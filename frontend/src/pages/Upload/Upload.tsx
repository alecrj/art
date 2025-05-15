import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { artAPI } from '../../services/api';
import { ArtworkSubmission } from '../../types';

const Upload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArtworkSubmission | null>(null);
  const [error, setError] = useState<string>('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        setError('');
        setResult(null);
      }
    }
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await artAPI.analyzeArtwork(selectedFile, notes);
      setResult(result);
    } catch (err) {
      setError('Failed to analyze artwork. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Upload Your Artwork
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#f5f5f5' : 'transparent',
            '&:hover': { backgroundColor: '#f9f9f9' }
          }}
        >
          <input {...getInputProps()} />
          {selectedFile ? (
            <Box>
              <Typography variant="h6">Selected: {selectedFile.name}</Typography>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: 300, marginTop: 16 }}
              />
            </Box>
          ) : (
            <Typography>
              {isDragActive
                ? 'Drop your artwork here...'
                : 'Drag & drop your artwork, or click to select'}
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Notes (optional)"
          placeholder="Tell us about your artwork, what you were trying to achieve, or areas you'd like feedback on..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          fullWidth
          size="large"
        >
          {loading ? <CircularProgress size={24} /> : 'Get AI Feedback'}
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            AI Feedback
          </Typography>
          <Box sx={{ mb: 2 }}>
            <img
              src={result.imageUrl}
              alt="Uploaded artwork"
              style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
            />
          </Box>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {result.analysis.feedback}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            Analysis generated on {new Date(result.analysis.timestamp).toLocaleString()}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Upload;
