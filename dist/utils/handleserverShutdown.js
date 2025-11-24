const handleServerShutdown = async () => {
    try {
        console.log('server SHUTDOWN');
        process.exit(0);
    }
    catch (error) {
        console.log('error during server shutdown : ', error);
    }
};
export default handleServerShutdown;
