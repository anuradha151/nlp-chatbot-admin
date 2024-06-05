import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItemText, Accordion, AccordionSummary, AccordionDetails, Link as LinkUI, Chip, Stack, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

import { Link } from "react-router-dom";

function Home() {
    const [intents, setIntents] = useState([]);

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

    return (
        <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
            <Stack direction="row" spacing={30}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Intent configurations
                </Typography>
                <Button variant="text"><Link to="/create-tag">Create New</Link></Button>
            </Stack>

            <List dense={false}>
                {intents.map((intent) => (
                    <Accordion key={intent.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${intent.id}`}>
                            {/* <ListItemText primary={<Typography variant="body1">{intent.tag}</Typography>} /> */}
                            <Typography variant="h6" gutterBottom>{intent.tag}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Button variant="text"><Link to={`/update-tag/${intent.tag}`}>Edit</Link></Button>
                            {intent.response_text && (
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {intent.response_text}
                                </Typography>
                            )}
                            {intent.input_patterns.length > 0 && (
                                <Stack direction="column" spacing={1}>
                                    {intent.input_patterns.map((pattern) => (
                                        <Chip key={pattern.id} label={pattern} color="primary" variant="outlined" />
                                    ))}
                                </Stack>

                            )}
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

