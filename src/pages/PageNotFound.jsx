import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                // height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: '#f0f4f7',
                textAlign: 'center',
                padding: '20px',
            }}
        >
            <Typography
                variant="h1"
                sx={{
                    fontSize: '96px',
                    fontWeight: 'bold',
                    // color: '#3f51b5',
                    marginBottom: '20px',
                }}
            >
                404
            </Typography>
            <Typography
                variant="h5"
                sx={{
                    fontSize: '24px',
                    marginBottom: '30px',
                    color: '#606c76',
                }}
            >
                Oops! The page you're looking for doesn't exist.
            </Typography>

            {/* <img
                src="https://www.pngwing.com/en/free-png-vrmua"
                alt="Page Not Found"
                style={{ marginBottom: '40px', maxWidth: '100%', height: 'auto' }}
            /> */}

            <Button
                variant="contained"
                color="primary"
                onClick={handleGoHome}
                sx={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    textTransform: 'none',
                    backgroundColor: '#3f51b5',
                    '&:hover': {
                        backgroundColor: '#2c387e',
                    },
                }}
            >
                Go Back Home
            </Button>
        </Box>
    );
};

export default PageNotFound;
