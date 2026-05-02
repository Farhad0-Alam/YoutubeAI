"""
PostgreSQL database connection using asyncpg + SQLAlchemy (async).
Replaces MongoDB entirely.
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from backend.config.settings import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
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
        await conn.run_sync(Base.metadata.create_all)
    print("✅ PostgreSQL connected and tables ready.")

async def close_db():
    await engine.dispose()
    print("Closed PostgreSQL connection.")

async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
