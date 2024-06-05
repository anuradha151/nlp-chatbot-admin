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

    const removeInput = (event) => {
    }

    const renderInputPatterns = (patterns) => {
        return patterns.map((pattern) => (
            <Chip key={pattern.id} label={pattern.text} color="primary" variant="outlined" onDelete={removeInput} />
        ));
    };
    return (
        <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
            <Stack direction="row" spacing={30}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Intent configurations
                </Typography>
                <Button variant="text"><Link to="/create-tag">Create New</Link></Button>
            </Stack>

            <List dense={false}>
                {intents.map((info) => (
                    <Accordion key={info.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${info.id}`}>
                            <ListItemText primary={<Typography variant="body1">{info.tag}</Typography>} />
                        </AccordionSummary>
                        <AccordionDetails>
                            {info.response_text && (
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {info.response_text}
                                </Typography>
                            )}
                            {info.input_patterns.length > 0 && (

                                <Stack direction="column" spacing={1}>
                                    {renderInputPatterns(info.input_patterns)}
                                </Stack>

                            )}
                            {info.tag === 'placement' && (
                                <LinkUI href={info.response_links[0].text} underline="none" sx={{ color: 'primary.main' }}>
                                    Learn More
                                </LinkUI>
                            )}
                            {info.tag === 'fees' && (
                                <Typography variant="body2">Visit ESOFT website for details.</Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </List>
        </Box>
    );
}

export default Home;

