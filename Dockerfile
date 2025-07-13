# ------------------------
# Stage 1: Base
# ------------------------
FROM python:3.12-slim AS base

 WORKDIR /app
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
RUN apt-get update && apt-get install -y libmagic1 net-tools curl
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
COPY ./ /app
RUN pip install uv


# ------------------------
# Stage 2: Development
# ------------------------
FROM base AS development
RUN uv venv 
RUN . .venv/bin/activate
RUN uv sync
EXPOSE 8000
# Start Django development server
ENTRYPOINT ["uv","run","python", "manage.py", "runserver", "0.0.0.0:8000"]


# ------------------------
# Stage 3: Production with Uvicorn
# ------------------------
FROM base AS production

# Create and activate venv, then install dependencies
RUN uv venv && \
    .venv/bin/uv pip install -e .

# Run migrations and collect static files
RUN .venv/bin/python manage.py migrate && \
    .venv/bin/python manage.py collectstatic --noinput


EXPOSE 8000

# Start production ASGI server (update `your_project.asgi` if needed)
ENTRYPOINT [".venv/bin/uvicorn", "core.asgi:application", "--host", "0.0.0.0", "--port", "8000"]
