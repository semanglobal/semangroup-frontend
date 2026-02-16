/*eslint-disable @typescript-eslint/no-explicit-any*/
import React, { useMemo, useState } from 'react';
import axios from 'axios';
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
import { PropertyService } from '../../services/propertyService';
import { fileUpload } from '../../services/fileUpload';

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

interface Property {
    _id?: string;
    title: string;
    description: string;
    price: number;
    location: Location;
    propertyType: string;
    status: string;
    area: number;
    thumbnail: string;
    images: string[];
    amenities: string[];
    isFeatured: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface AddPropertyModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (newProperty: Property) => void;
}

const propertyTypes = ["apartment", "house", "land"];
const statusOptions = ['for-sale', 'for-rent', 'sold'];
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

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
    open,
    onClose,
    onAdd
}) => {
    const [formData, setFormData] = useState<Property>({
        title: '',
        description: '',
        price: 0,
        location: {
            lat: 0,
            long: 0,
            address: '',
            city: '',
            state: '',
            country: 'Nigeria'
        },
        propertyType: 'apartment',
        status: 'for-sale',
        area: 0,
        thumbnail: '',
        images: [],
        amenities: [],
        isFeatured: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newAmenity, setNewAmenity] = useState('');

    // Image upload states
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
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

    // Updated React Quill handler
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

    // Thumbnail image handlers
    const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
        }
    };

    const removeThumbnail = () => {
        setThumbnailFile(null);
        setThumbnailPreview(null);
    };

    // Gallery images handlers
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
    };

    const uploadThumbnail = async (): Promise<string> => {
        if (!thumbnailFile) {
            toast.error('Please select a thumbnail image');
            throw new Error('No thumbnail selected');
        }

        setUploadingThumbnail(true);
        try {
            const formData = new FormData();
            formData.append('file', thumbnailFile);
            const url = await fileUpload(formData);
            return url;
        } catch (error) {
            toast.error('Failed to upload thumbnail');
            throw error;
        } finally {
            setUploadingThumbnail(false);
        }
    };

    const uploadGalleryImages = async (): Promise<string[]> => {
        if (galleryFiles.length === 0) return [];

        setUploadingGallery(true);
        try {
            const uploadPromises = galleryFiles.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                return await fileUpload(formData);
            });

            const urls = await Promise.all(uploadPromises);
            return urls;
        } catch (error) {
            toast.error('Failed to upload gallery images');
            throw error;
        } finally {
            setUploadingGallery(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            price: 0,
            location: {
                lat: 0,
                long: 0,
                address: '',
                city: '',
                state: '',
                country: 'Nigeria'
            },
            propertyType: 'apartment',
            status: 'for-sale',
            area: 0,
            thumbnail: '',
            images: [],
            amenities: [],
            isFeatured: false
        });
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setGalleryFiles([]);
        setGalleryPreviews([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Upload images
            const thumbnailUrl = await uploadThumbnail();
            const galleryUrls = await uploadGalleryImages();

            const payload = {
                ...formData,
                thumbnail: thumbnailUrl,
                images: galleryUrls
            };

            const response = await PropertyService.addProperty(payload);
            onAdd(response.data);
            toast.success('Property added successfully');
            resetForm();
            onClose();
        } catch (err) {
            setError('Failed to add property. Please try again.');
            toast.error('Failed to add property');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            resetForm();
            setError(null);
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
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
                            Add New Property
                        </Typography>
                        <IconButton onClick={handleClose} size="small" disabled={loading}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* Form Content */}
                <Box sx={{ p: 3 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {/* Basic Information Section */}
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
                                        placeholder="e.g., Modern 3-Bedroom Apartment"
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
                                                marginBottom: '40px' // Space for toolbar overlap
                                            }}
                                            className='text-gray-800'
                                        />
                                    </Box>

                                    <Grid container spacing={2}>
                                        <div>
                                            <TextField
                                                fullWidth
                                                label="Price (₦)"
                                                name="price"
                                                type="number"
                                                value={formData.price || ''}
                                                onChange={handleInputChange}
                                                required
                                                size="small"
                                                placeholder="e.g., 5000000"
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                fullWidth
                                                label="Area (m²)"
                                                name="area"
                                                type="number"
                                                value={formData.area || ''}
                                                onChange={handleInputChange}
                                                required
                                                size="small"
                                                placeholder="e.g., 120"
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
                                                        {status === 'for-sale' ? 'For Sale' : status === 'for-rent' ? 'For Rent' : 'Sold'}
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
                                        label="Featured Property (will be highlighted on homepage)"
                                    />
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Location Section */}
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
                                        placeholder="e.g., 15 Victoria Island Road"
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
                                                placeholder="e.g., Lagos"
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
                                                placeholder="e.g., Lagos"
                                            />
                                        </div>
                                        <div>
                                            <TextField
                                                fullWidth
                                                label="Latitude"
                                                name="lat"
                                                type="number"
                                                inputProps={{
                                                    step: "0.000001", // Allow decimal input
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
                                                    step: "0.000001", // Allow decimal input
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

                            {/* Images Section */}
                            <Box>
                                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                                    Images
                                </Typography>
                                <Stack spacing={3} sx={{ mt: 2 }}>
                                    {/* Thumbnail Upload */}
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                            Thumbnail Image *
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            {thumbnailPreview ? (
                                                <Box sx={{ position: 'relative' }}>
                                                    <Box
                                                        component="img"
                                                        src={thumbnailPreview}
                                                        alt="Thumbnail preview"
                                                        sx={{
                                                            width: 120,
                                                            height: 120,
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
                                                        width: 120,
                                                        height: 120,
                                                        border: '2px dashed',
                                                        borderColor: 'divider',
                                                        borderRadius: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: 'grey.50'
                                                    }}
                                                >
                                                    <ImageIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
                                                </Box>
                                            )}

                                            <Box>
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    startIcon={<UploadIcon />}
                                                    size="small"
                                                >
                                                    Choose Thumbnail
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={handleThumbnailSelect}
                                                    />
                                                </Button>
                                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                                    JPG, PNG or GIF (Max 5MB)
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Gallery Upload */}
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                            Gallery Images (Optional)
                                        </Typography>

                                        <Button
                                            component="label"
                                            variant="outlined"
                                            startIcon={<UploadIcon />}
                                            size="small"
                                            sx={{ mb: 2 }}
                                        >
                                            Add Gallery Images
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
                                                            alt={`Gallery ${index + 1}`}
                                                            sx={{
                                                                width: 100,
                                                                height: 100,
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

                            {/* Amenities Section */}
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
                                                placeholder="e.g., Rooftop Terrace"
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

                {/* Footer with Action Buttons */}
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
                            onClick={handleClose}
                            disabled={loading || uploadingThumbnail || uploadingGallery}
                            size="medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#c20021' }}
                            disabled={loading || uploadingThumbnail || uploadingGallery}
                            onClick={handleSubmit}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                            size="medium"
                        >
                            {loading ? 'Adding...' : uploadingThumbnail || uploadingGallery ? 'Uploading...' : 'Add Property'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddPropertyModal;