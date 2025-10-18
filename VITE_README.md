# Instructions for experimental single-page-application based on Vite

## Run in debug mode

### Run frontend

```
# If dependencies are already installed, skip this command
npm install

# Run development server
npm run dev
```

### Run backend

```
# This is only for illustration purposes; please run Promgen using your usual method
export DEBUG=1
.venv/bin/promgen runserver
```

## Run in production mode

### Build frontend

```
# If dependencies are already installed, skip this command
npm install

# Build frontend
npm run build
```

### Run backend

```
# This is only for illustration purposes; please run Promgen using your usual method
.venv/bin/promgen runserver
```
