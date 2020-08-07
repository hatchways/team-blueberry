# EXPRESS-STARTER

## Running MongoDB locally
1. Go to [MongoDB](https://docs.mongodb.com/manual/installation/)
2. Follow instructions on installing MongoDB Community
3. Run MongoDB server from terminal
4. Connect to local url: mongodb://localhost:{DEFAULT_PORT=27017}/{LOCAL_DB_NAME}

## Running Redis locally
1. On terminal, install [Homebrew](https://brew.sh/)
2. Run `brew install redis`
3. Start redis service `brew services start redis`
4. Run redis server `redis-server`
5. To check if redis server is running, enter `redis-cli ping` and command line will output `PONG`
6. Stop redis server by pressing **CONTROL+C** 
7. Stop redis service `brew services stop redis`