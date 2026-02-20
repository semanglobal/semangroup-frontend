/*eslint-disable @typescript-eslint/no-explicit-any*/
import React, { useState, useEffect, useMemo } from 'react';
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    MenuItem,
    Chip,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Checkbox,
    ListItemText,
    type SelectChangeEvent,
    Alert,
    CircularProgress,
    FormControlLabel,
    Divider,
    Stack
} from '@mui/material';
import {
    Close as CloseIcon,
    Add as AddIcon,
    Upload as UploadIcon,
    Image as ImageIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { fileUpload } from '../../services/fileUpload';
import { PropertyService } from '../../services/propertyService';
import type { PropertyType } from '../../types/propertyType';

// Import React Quill
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Location {
    lat: number;
    long: number;
    address: string;
    city: string;
    state: string;
    country: string;
}

interface EditPropertyModalProps {
    open: boolean;
    property: PropertyType;
    onClose: () => void;
    onUpdate: (updatedProperty: PropertyType) => void;
}

const propertyTypes = ["apartment", "house", "land"];
const statusOptions = ['for-sale', 'for-rent'];
const predefinedAmenities = [
    '24/7 Electricity',
    'Security',
    'Parking Space',
    'Swimming Pool',
    'Gym',
    'Air Conditioning',
    'WiFi',
    'Laundry',
    'Balcony',
    'Garden'
];

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
    open,
    property,
    onClose,
    onUpdate
}) => {
    const [formData, setFormData] = useState<PropertyType>(property);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newAmenity, setNewAmenity] = useState('');

    // Image upload states
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>(property.thumbnail || '');
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>(property.images || []);

    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);

    // React Quill modules configuration
    const quillModules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image'],
                ['clean']
            ],
        },
    }), []);

    const quillFormats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    useEffect(() => {
        if (property) {
            setFormData(property);
            setThumbnailPreview(property.thumbnail || '');
            setGalleryPreviews(property.images || []);
            // Reset pending new files when property changes
            setThumbnailFile(null);
            setGalleryFiles([]);
        }
    }, [property]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [name]: name === 'lat' || name === 'long' ? parseFloat(value) || 0 : value
            }
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // React Quill handler
    const handleQuillChange = (value: string) => {
        setFormData(prev => ({ ...prev, description: value }));
    };

    const handleAmenitiesChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setFormData(prev => ({
            ...prev,
            amenities: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const addNewAmenity = () => {
        if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, newAmenity.trim()]
            }));
            setNewAmenity('');
        }
    };

    const removeAmenity = (amenityToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.filter(a => a !== amenityToRemove)
        }));
    };

    // Thumbnail handlers
    const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            setThumbnailPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeThumbnail = () => {
        setThumbnailFile(null);
        setThumbnailPreview('');
    };

    // Gallery handlers
    const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not an image file`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 5MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        setGalleryFiles(prev => [...prev, ...validFiles]);

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setGalleryPreviews(prev => [...prev, event.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeGalleryImage = (index: number) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));

        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    // Upload functions
    const uploadThumbnailIfNew = async (): Promise<string> => {
        if (!thumbnailFile) {
            // Keep existing thumbnail if no new file selected
            return formData.thumbnail || '';
        }

        setUploadingThumbnail(true);
        try {
            const formData = new FormData();
            formData.append('file', thumbnailFile);
            const url = await fileUpload(formData);
            return url;
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            toast.error('Failed to upload thumbnail');
            throw error;
        } finally {
            setUploadingThumbnail(false);
        }
    };

    const uploadNewGalleryImages = async (): Promise<string[]> => {
        if (galleryFiles.length === 0) {
            // Keep existing gallery images if no new files
            return formData.images || [];
        }

        setUploadingGallery(true);
        try {
            const uploadPromises = galleryFiles.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                return await fileUpload(formData);
            });

            const newUrls = await Promise.all(uploadPromises);

            // Append new images to existing ones (most common edit behavior)
            return [...(formData.images || []), ...newUrls];
        } catch (error) {
            console.error('Error uploading gallery images:', error);
            toast.error('Failed to upload gallery images');
            throw error;
        } finally {
            setUploadingGallery(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const thumbnailUrl = await uploadThumbnailIfNew();
            const updatedImages = await uploadNewGalleryImages();

            const payload = {
                ...formData,
                thumbnail: thumbnailUrl,
                images: updatedImages
            };

            const response = await PropertyService.updateProperty(payload, property._id);

            onUpdate(response.data);
            toast.success('Property updated successfully');
            onClose();
        } catch (err) {
            setError('Failed to update property. Please try again.');
            console.error('Error updating property:', err);
            toast.error('Failed to update property');
        } finally {
            setLoading(false);
        }
    };

    if (!property) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '95%', sm: '90%', md: '85%', lg: '800px' },
                maxHeight: '90vh',
                overflow: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
            }}>
                {/* Header */}
                <Box sx={{
                    p: 3,
                    pb: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    position: 'sticky',
                    top: 0,
                    bgcolor: 'background.paper',
                    zIndex: 1,
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5" component="h2" fontWeight="600">
                            Edit Property
                        </Typography>
                        <IconButton onClick={onClose} size="small" disabled={loading}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* Form Content */}
                <Box sx={{ p: 3 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {/* Basic Information */}
                            <Box>
                                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                    Basic Information
                                </Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Property Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        size="small"
                                    />

                                    {/* Replaced TextField with ReactQuill */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                            Description *
                                        </Typography>
                                        <ReactQuill
                                            value={formData.description}
                                            onChange={handleQuillChange}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            theme="snow"
                                            placeholder="Describe the property, its features, and nearby amenities..."
                                            style={{
                                                height: '200px',
                                                marginBottom: '40px'
                                            }}
                                        />
                                    </Box>

                                    <Grid container spacing={2}>
                                        <div>
                                            <TextField
                                                fullWidth
                                                label="Price (₦)"
                                                name="price"
                                                type="number"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                required
                                                size="small"
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                fullWidth
                                                label="Area (m²)"
                                                name="area"
                                                type="number"
                                                value={formData.area}
                                                onChange={handleInputChange}
                                                required
                                                size="small"
                                            />
                                        </div>
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <div>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Property Type"
                                                name="propertyType"
                                                value={formData.propertyType}
                                                onChange={(e) => handleSelectChange(e as any)}
                                                required
                                                size="small"
                                            >
                                                {propertyTypes.map(type => (
                                                    <MenuItem key={type} value={type}>
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                        <div>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Status"
                                                name="status"
                                                value={formData.status}
                                                onChange={(e) => handleSelectChange(e as any)}
                                                required
                                                size="small"
                                            >
                                                {statusOptions.map(status => (
                                                    <MenuItem key={status} value={status}>
                                                        {status === 'for-sale' ? 'For Sale' : 'For Rent'}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                    </Grid>

                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="isFeatured"
                                                checked={formData.isFeatured}
                                                onChange={handleCheckboxChange}
                                            />
                                        }
                                        label="Featured Property"
                                    />
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Location */}
                            <Box>
                                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                    Location
                                </Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Street Address"
                                        name="address"
                                        value={formData.location.address}
                                        onChange={handleLocationChange}
                                        required
                                        size="small"
                                    />

                                    <Grid container spacing={2}>
                                        <div>
                                            <TextField
                                                fullWidth
                                                label="City"
                                                name="city"
                                                value={formData.location.city}
                                                onChange={handleLocationChange}
                                                required
                                                size="small"
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                fullWidth
                                                label="State"
                                                name="state"
                                                value={formData.location.state}
                                                onChange={handleLocationChange}
                                                required
                                                size="small"
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                fullWidth
                                                label="Latitude"
                                                name="lat"
                                                type="number"
                                                inputProps={{
                                                    step: "0.000001",
                                                }}
                                                value={formData.location.lat || ''}
                                                onChange={handleLocationChange}
                                                required
                                                size="small"
                                                placeholder="e.g., 6.524379"
                                                helperText="Decimal format (e.g., 6.524379)"
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                fullWidth
                                                label="Longitude"
                                                name="long"
                                                type="number"
                                                inputProps={{
                                                    step: "0.000001",
                                                }}
                                                value={formData.location.long || ''}
                                                onChange={handleLocationChange}
                                                required
                                                size="small"
                                                placeholder="e.g., 3.379206"
                                                helperText="Decimal format (e.g., 3.379206)"
                                            />
                                        </div>
                                    </Grid>

                                    <TextField
                                        fullWidth
                                        label="Country"
                                        name="country"
                                        value={formData.location.country}
                                        onChange={handleLocationChange}
                                        required
                                        size="small"
                                    />
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Images Section - UPLOAD */}
                            <Box>
                                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                    Images
                                </Typography>
                                <Stack spacing={4} sx={{ mt: 2 }}>
                                    {/* Thumbnail Upload */}
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                            Thumbnail Image *
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                                            {thumbnailPreview ? (
                                                <Box sx={{ position: 'relative' }}>
                                                    <Box
                                                        component="img"
                                                        src={thumbnailPreview}
                                                        alt="Thumbnail preview"
                                                        sx={{
                                                            width: 140,
                                                            height: 140,
                                                            objectFit: 'cover',
                                                            borderRadius: 2,
                                                            border: '2px solid',
                                                            borderColor: 'divider'
                                                        }}
                                                    />
                                                    <IconButton
                                                        onClick={removeThumbnail}
                                                        size="small"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: -8,
                                                            right: -8,
                                                            bgcolor: 'error.main',
                                                            color: 'white',
                                                            '&:hover': { bgcolor: 'error.dark' }
                                                        }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        width: 140,
                                                        height: 140,
                                                        border: '2px dashed',
                                                        borderColor: 'divider',
                                                        borderRadius: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: 'grey.50'
                                                    }}
                                                >
                                                    <ImageIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                                                </Box>
                                            )}

                                            <Box>
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    startIcon={<UploadIcon />}
                                                    size="small"
                                                >
                                                    {thumbnailFile ? 'Change Thumbnail' : 'Choose Thumbnail'}
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleThumbnailSelect}
                                                    />
                                                </Button>
                                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                                    JPG, PNG, GIF (Max 5MB)
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Gallery Upload */}
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                            Gallery Images
                                        </Typography>

                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<UploadIcon />}
                                            size="small"
                                            sx={{ mb: 2 }}
                                        >
                                            Add More Images
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                multiple
                                                onChange={handleGallerySelect}
                                            />
                                        </Button>

                                        {galleryPreviews.length > 0 && (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                                                {galleryPreviews.map((preview, index) => (
                                                    <Box key={index} sx={{ position: 'relative' }}>
                                                        <Box
                                                            component="img"
                                                            src={preview}
                                                            alt={`Gallery image ${index + 1}`}
                                                            sx={{
                                                                width: 110,
                                                                height: 110,
                                                                objectFit: 'cover',
                                                                borderRadius: 1,
                                                                border: '1px solid',
                                                                borderColor: 'divider'
                                                            }}
                                                        />
                                                        <IconButton
                                                            onClick={() => removeGalleryImage(index)}
                                                            size="small"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: -8,
                                                                right: -8,
                                                                bgcolor: 'error.main',
                                                                color: 'white',
                                                                '&:hover': { bgcolor: 'error.dark' }
                                                            }}
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Amenities */}
                            <Box>
                                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                    Amenities
                                </Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Select Amenities</InputLabel>
                                        <Select
                                            multiple
                                            value={formData.amenities}
                                            onChange={handleAmenitiesChange}
                                            input={<OutlinedInput label="Select Amenities" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} size="small" />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {predefinedAmenities.map((amenity) => (
                                                <MenuItem key={amenity} value={amenity}>
                                                    <Checkbox
                                                        checked={formData.amenities.indexOf(amenity) > -1}
                                                        size="small"
                                                    />
                                                    <ListItemText primary={amenity} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Box>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                            <TextField
                                                fullWidth
                                                label="Add Custom Amenity"
                                                value={newAmenity}
                                                onChange={(e) => setNewAmenity(e.target.value)}
                                                size="small"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addNewAmenity();
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="outlined"
                                                onClick={addNewAmenity}
                                                startIcon={<AddIcon />}
                                                sx={{ minWidth: '100px', height: '40px' }}
                                            >
                                                Add
                                            </Button>
                                        </Box>

                                        {formData.amenities.length > 0 && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                                    Selected Amenities ({formData.amenities.length})
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {formData.amenities.map((amenity) => (
                                                        <Chip
                                                            key={amenity}
                                                            label={amenity}
                                                            onDelete={() => removeAmenity(amenity)}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                </Stack>
                            </Box>
                        </Stack>
                    </form>
                </Box>

                {/* Footer */}
                <Box sx={{
                    p: 3,
                    pt: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    position: 'sticky',
                    bottom: 0,
                    bgcolor: 'background.paper',
                    zIndex: 1,
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            disabled={loading || uploadingThumbnail || uploadingGallery}
                            size="medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            disabled={loading || uploadingThumbnail || uploadingGallery}
                            onClick={handleSubmit}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                            size="medium"
                            style={{ backgroundColor: '#c20021' }}
                        >
                            {loading || uploadingThumbnail || uploadingGallery ? 'Updating...' : 'Update Property'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditPropertyModal;