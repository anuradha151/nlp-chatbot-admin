import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography, List, ListItemText, Accordion, AccordionSummary, AccordionDetails, Link as LinkUI, Chip, Stack, Button, Divider, Alert, AlertTitle, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

import { Link } from "react-router-dom";

function Home() {
    const [intents, setIntents] = useState([]);
    const [alert, setAlert] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/admin/intents');
                setIntents(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleDeployAPI = async () => {
        setOpen(false);
        setLoading(true);
        try {
            await axios.get('http://localhost:8000/admin/model/train/deploy');
            setLoading(false);
            setAlert({ title: 'Success', message: 'Chatbot updated successfully', severity: 'success' });
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
            setAlert({ title: 'Error', message: 'Unable to deploy the changes', severity: 'error' });
        }
    };

    return (
        <Box sx={{ width: '100%', margin: 'auto' }}>
            <AppBar position="static" sx={{ mb: 4, backgroundColor:'#0c6658' }}>
                <Toolbar>
                    <SmartToyIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, marginRight:2}} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Admin Panel
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ maxWidth: 600, ml: '30%', mt: 6, justifyContent: 'center' }}>
                <Stack direction="row" spacing={1} justifyContent='space-between'>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Intent configurations
                    </Typography>
                    <Button variant="contained" color="error" onClick={handleClickOpen}>
                        Deploy Model
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            WARNING!!! WARNING!!! Confirmation Required
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Updating model with new changes can be a time-consuming process.
                                This action cannot be undone. Are you sure you want to proceed?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>I am not Sure</Button>
                            <Button onClick={handleDeployAPI} autoFocus>
                                Yes, Update
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Button variant="contained" component={Link} to="/create-tag" sx={{backgroundColor:'#0c6658'}}>Create New</Button>
                </Stack>
                {alert && (
                    <Alert
                        severity={alert.severity}
                        onClose={() => setAlert(null)}
                        sx={{ mt: 2 }}
                    >
                        <AlertTitle>{alert.title}</AlertTitle>
                        {alert.message}
                    </Alert>
                )}
                {loading && (
                    <Box sx={{ display: 'flex', ml: "50%", mt: 2 }}>
                        <CircularProgress />
                    </Box>
                )}


                <List dense={false}>
                    {intents.map((intent) => (
                        <Accordion key={intent.id}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${intent.id}`}>
                                <Typography variant="h6" gutterBottom>{intent.tag}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Button variant="contained" color="success" component={Link} to={`/update-tag/${intent.tag}`}>Edit</Button>
                                {intent.response_text && (
                                    <Typography variant="body2" sx={{ mb: 2, mt: 2 }}>
                                        Response Text: {intent.response_text}
                                    </Typography>
                                )}
                                <Typography variant="body2" sx={{ mb: 2 }}>Input Patterns: </Typography>
                                {intent.input_patterns.length > 0 && (
                                    <Stack direction="column" spacing={1}>
                                        {intent.input_patterns.map((pattern) => (
                                            <Chip key={pattern.id} label={pattern} color="primary" variant="outlined" />
                                        ))}
                                    </Stack>

                                )}
                                <Typography variant="body2" sx={{ mb: 2, mt: 2 }}>Response Links: </Typography>
                                {intent.response_links.length > 0 && (
                                    <Stack direction="column" spacing={1}>
                                        {intent.response_links.map((link) => (
                                            <LinkUI key={link.id} href={link} target="_blank">
                                                {link}
                                            </LinkUI>
                                        ))}
                                    </Stack>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </List>

            </Box>

        </Box>
    );
}

export default Home;

