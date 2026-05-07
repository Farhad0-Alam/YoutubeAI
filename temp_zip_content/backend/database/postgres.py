"""
PostgreSQL database connection using asyncpg + SQLAlchemy (async).
Replaces MongoDB entirely.
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from backend.config.settings import settings

# Adjust engine arguments based on DB type
engine_args = {"echo": False}
if "postgresql" in settings.DATABASE_URL:
    engine_args.update({
        "pool_pre_ping": True,
        "pool_size": 5,
        "max_overflow": 10
    })

engine = create_async_engine(
    settings.DATABASE_URL,
    **engine_args
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def init_db():
    """Create all tables on startup."""
    async with engine.begin() as conn:
        # Import models here to ensure they are registered with Base.metadata
        from backend.database import models
        await conn.run_sync(Base.metadata.create_all)
    print(f"Database connected ({settings.DATABASE_URL.split(':')[0]}) and tables ready.")

async def close_db():
    await engine.dispose()
    print("Database connection closed.")

async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
