import React, { useState } from 'react';
import * as yup from 'yup'; // for validation (optional)
import { useForm } from 'react-hook-form'; // for form handling (optional)
import { TextField, Button, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Stack, Box, Typography } from '@mui/material';
import axios from 'axios'; // Import axios
import { Link } from 'react-router-dom';

const schema = yup.object().shape({ // define validation schema (optional)
    tag: yup.string().required('Tag is required'),
    response_text: yup.string().required('Response text is required'),
    input_patterns: yup.array().of(yup.string().required('Input pattern is required')),
    response_links: yup.array().of(yup.string().url('Invalid URL format')),
});

const CreateTag = () => {
    const [formData, setFormData] = useState({
        tag: '',
        response_text: '',
        input_patterns: [],
        response_links: []
    });

    // Use react-hook-form for validation and form handling (optional)
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: formData });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:8000/admin/intent/create', data, { // Use axios.post
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.data.success) { // Check for success response from backend (modify based on your API)
                throw new Error(response.data.message || 'Error publishing data');
            }

            console.log('Data published successfully!');
            setFormData({
                tag: '',
                response_text: '',
                input_patterns: [],
                response_links: []
            });
        } catch (error) {
            console.error('Error publishing data:', error);
        }
    };

    return (

        <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
            <Stack direction="row" spacing={30}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Intent configurations
                </Typography>
                <Button variant="text"><Link to="/">Back</Link></Button>
            </Stack>
                <FormControl>
                    <FormLabel>Tag</FormLabel>
                    <TextField
                        {...register('tag', { ...schema?.fields?.tag })} // use register with validation schema (optional)
                        label="Tag"
                        name="tag"
                        value={formData.tag}
                        onChange={handleChange}
                        error={!!errors.tag} // show error if present (optional)
                        helperText={errors.tag?.message} // display error message (optional)
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        {...register('response_text', { ...schema?.fields?.response_text })} // use register with validation schema (optional)
                        label="Response Text"
                        multiline
                        rows={4}
                        name="response_text"
                        value={formData.response_text}
                        onChange={handleChange}
                        error={!!errors.response_text} // show error if present (optional)
                        helperText={errors.response_text?.message} // display error message (optional)
                    />
                </FormControl>
                <FormControl component="fieldset" legend="Input Patterns">
                    <FormGroup>
                        {formData.input_patterns.map((pattern, index) => (
                            <FormControlLabel
                                key={index}
                                control={<Checkbox checked={true} onChange={() => { }} />} // pre-checked checkboxes (modify for dynamic control)
                                label={pattern}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
                <FormControl>
                    <TextField
                        {...register('response_links', { ...schema?.fields?.response_links })} // use register with validation schema (optional)
                        label="Response Links"
                        name="response_links"
                        value={formData.response_links.join(', ')} // convert array to comma-separated string
                        onChange={(event) => setFormData({ ...formData, response_links: event.target.value.split(',') })}
                        error={!!errors.response_links} // show error if present (optional)
                        helperText={errors.response_links?.message} // display error message (optional)
                    />
                </FormControl>
                <Button type="submit" variant="contained">
                    Create Tag
                </Button>
            </Stack>
        </form>
        </Box>
    );
};

export default CreateTag;
