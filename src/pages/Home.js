import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItemText, Accordion, AccordionSummary, AccordionDetails, Link as LinkUI, Chip, Stack, Button, Divider, Alert, AlertTitle } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

import { Link } from "react-router-dom";

function Home() {
    const [intents, setIntents] = useState([]);
    const [alert, setAlert] = useState(null);

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
        try {
            await axios.get('http://localhost:8000/admin/model/train/deploy');
            setAlert({ title: 'Success', message: 'Chatbot updated successfully', severity: 'success' });
        } catch (error) {
            console.error('Error fetching data:', error);
            setAlert({ title: 'Error', message: 'Unable to deploy the changes', severity: 'error' });
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', mt: 2 }}>
           <Stack direction="row" spacing={1} justifyContent='space-between'>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Intent configurations
                </Typography>
                <Button variant="contained" color="error" onClick={handleDeployAPI} to="/create-tag" >Deploy Model</Button>
                <Button variant="contained" component={Link} to="/create-tag" >Create New</Button>
            </Stack>
            {alert && (
                    <Alert
                        severity={alert.severity}
                        onClose={() => setAlert(null)}
                    >
                        <AlertTitle>{alert.title}</AlertTitle>
                        {alert.message}
                    </Alert>
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
    );
}

export default Home;

