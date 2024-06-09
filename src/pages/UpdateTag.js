/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { TextField, Button, FormControl, FormGroup, Stack, Box, Typography, Link as LinkUI, Alert, AlertTitle } from '@mui/material';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';


const UpdateTag = () => {

    const params = useParams();

    const [tag, setTag] = useState('');
    const [responseText, setResponseText] = useState('');
    const [inputPattern, setInputPattern] = useState('');
    const [inputPatterns, setInputPatterns] = useState([]);
    const [responseLink, setResponseLink] = useState('');
    const [responseLinks, setResponseLinks] = useState([]);

    const [alert, setAlert] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/admin/intent/${params.tag}`);
            setTag(response.data.tag);
            setResponseText(response.data.response_text);
            setInputPatterns(response.data.input_patterns);
            setResponseLinks(response.data.response_links);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSubmit = async () => {
        const data = {
            tag,
            response_text: responseText,
            input_patterns: inputPatterns,
            response_links: responseLinks
        };

        axios.put('http://localhost:8000/admin/intent/update', data, {
            headers: { 'Content-Type': 'application/json' },
        }).then(() => {
            setAlert({ title: 'Success', message: 'Successfully Submitted', severity: 'success' });

            setTag('');
            setResponseText('');
            setInputPattern('');
            setInputPatterns([]);
            setResponseLink('');
            setResponseLinks([]);
        }).catch((error) => {
            setAlert({ title: 'Error', message: error.response.data.detail, severity: 'error' });
        });
    };

    const handleAdd = () => {
        const lines = inputPattern
            .split(/\r?\n/) 
            .filter(line => line.trim() !== ''); 

        setInputPatterns([...inputPatterns, ...lines]);
        setInputPattern('');
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', mt: 2 }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={1} justifyContent='space-between'>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Intent configurations
                    </Typography>
                    <Button variant="contained" component={Link} to="/" color="warning" >Back</Button>
                </Stack>
                <FormControl>
                    <TextField
                        label="Tag"
                        name="tag"
                        value={tag}
                        onChange={event => setTag(event.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="Response Text"
                        name="response_text"
                        value={responseText}
                        onChange={event => setResponseText(event.target.value)}
                    />
                </FormControl>
                <FormControl>
                <TextField
                        id="outlined-multiline-static"
                        label="Input Patterns"
                        multiline
                        rows={8}
                        value={inputPattern}
                        onChange={event => setInputPattern(event.target.value)}
                        sx={{ whiteSpace: 'pre-wrap' }}
                    />
                    <Button disabled={inputPattern === ''} onClick={handleAdd}>
                        Add
                    </Button>
                </FormControl>
                <FormControl component="fieldset" legend="Input Patterns">
                    <FormGroup>
                        {inputPatterns.map((pattern, index) => (
                            <div key={index}                                >
                                {pattern}
                                <Button color="error" onClick={() => setInputPatterns(inputPatterns.filter((_, i) => i !== index))} >Remove</Button>
                            </div>
                        ))}
                    </FormGroup>
                </FormControl>
                <FormControl>
                    <TextField
                        label="Redirect Urls"
                        name="response_links"
                        value={responseLink} 
                        onChange={event => setResponseLink(event.target.value)}
                    />
                    <Button disabled={responseLink === ''} onClick={() => {
                        setResponseLinks([...responseLinks, responseLink])
                        setResponseLink('')
                    }} >Add</Button>
                </FormControl>
                <FormControl component="fieldset" legend="Redirect Urls">
                    <FormGroup>
                        {responseLinks.map((link, index) => (
                            <div key={index}                                >
                                <LinkUI href={link} underline="none" sx={{ color: 'primary.main' }} target='_blank' > {link} </LinkUI>
                                <Button color="error" onClick={() => setResponseLinks(responseLinks.filter((_, i) => i !== index))} >Remove</Button>
                            </div>
                        ))}
                    </FormGroup>
                </FormControl>
                {alert && (
                    <Alert
                        severity={alert.severity}
                        onClose={() => setAlert(null)}
                    >
                        <AlertTitle>{alert.title}</AlertTitle>
                        {alert.message}
                    </Alert>
                )}
                <Button type="submit" variant="contained" onClick={onSubmit}>
                    Update Tag
                </Button>
            </Stack>
        </Box>
    );
};

export default UpdateTag;
