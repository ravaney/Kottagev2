import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { CloudUploadOutlined, Close, DeleteOutline } from '@mui/icons-material';
import {
  EventInput,
  EventRecord,
  EventStatus,
  eventCategoryOptions,
} from '../../hooks/eventHooks';
import PillButton from '../common/PillButton';

export interface EventFormState {
  title: string;
  summary: string;
  description: string;
  category: EventInput['category'];
  status: EventStatus;
  featured: boolean;
  organizer: string;
  venueName: string;
  city: string;
  parish: string;
  address: string;
  startDate: string;
  endDate: string;
  generalTierId: string;
  generalTierName: string;
  generalTierPerks: string;
  generalPrice: string;
  generalRemaining: string;
  vipTierId: string;
  vipTierName: string;
  vipTierPerks: string;
  vipPrice: string;
  vipRemaining: string;
  tags: string;
  perks: string;
  lineup: string;
  couponCode: string;
  couponDescription: string;
  couponDiscount: string;
  couponExpires: string;
  ticketUrl: string;
  website: string;
}

export interface ExistingEventImageDraft {
  id: string;
  type: 'existing';
  url: string;
}

export interface NewEventImageDraft {
  id: string;
  type: 'new';
  url: string;
  file: File;
}

export type EventImageDraft = ExistingEventImageDraft | NewEventImageDraft;

export const createDefaultFormState = (): EventFormState => ({
  title: '',
  summary: '',
  description: '',
  category: 'Culture',
  status: 'published',
  featured: false,
  organizer: '',
  venueName: '',
  city: 'Kingston',
  parish: 'St. Andrew',
  address: '',
  startDate: '2026-04-25T18:00',
  endDate: '2026-04-25T22:00',
  generalTierId: 'general',
  generalTierName: 'General Admission',
  generalTierPerks: 'General entry',
  generalPrice: '45',
  generalRemaining: '120',
  vipTierId: 'vip',
  vipTierName: 'VIP',
  vipTierPerks: 'VIP access, Premium perks',
  vipPrice: '',
  vipRemaining: '30',
  tags: 'Live, Featured',
  perks: 'Fast entry, Welcome drink',
  lineup: '',
  couponCode: '',
  couponDescription: '',
  couponDiscount: '',
  couponExpires: '2026-04-20T23:59',
  ticketUrl: '',
  website: '',
});

interface EventEditorDrawerProps {
  open: boolean;
  isSaving: boolean;
  isEditing: boolean;
  editingEvent: EventRecord | null;
  formState: EventFormState;
  formError: string | null;
  imageDrafts: EventImageDraft[];
  imageCount: number;
  hiddenTicketTierCount: number;
  uploadImagesPending: boolean;
  onClose: () => void;
  onCancelEdit: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onFieldChange: (
    field: keyof EventFormState
  ) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onImageFilesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (imageDraftId: string) => void;
  onSetCoverImage: (imageDraftId: string) => void;
  onTogglePublish: () => void;
  onToggleFeature: () => void;
  onMarkSoldOut: () => void;
  onCancelEvent: () => void;
  onDeleteEvent: () => void;
}

export default function EventEditorDrawer({
  open,
  isSaving,
  isEditing,
  editingEvent,
  formState,
  formError,
  imageDrafts,
  imageCount,
  hiddenTicketTierCount,
  uploadImagesPending,
  onClose,
  onCancelEdit,
  onSubmit,
  onFieldChange,
  onImageFilesChange,
  onRemoveImage,
  onSetCoverImage,
  onTogglePublish,
  onToggleFeature,
  onMarkSoldOut,
  onCancelEvent,
  onDeleteEvent,
}: EventEditorDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 560, md: 640 },
          maxWidth: '100%',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Card
          sx={{
            borderRadius: 0,
            height: '100%',
            boxShadow: 'none',
            overflowY: 'auto',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ px: 3, pt: 3, pb: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Box sx={{ pr: 1 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      color: '#0f172a',
                      mb: 1,
                    }}
                  >
                    {isEditing ? 'Edit event' : 'Add an event'}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.8,
                      maxWidth: 460,
                    }}
                  >
                    {isEditing
                      ? 'Update guest-facing event details, ticket fields, photos, and promo settings.'
                      : 'Create a published or draft event with uploaded photos, tickets, and optional coupons.'}
                  </Typography>
                </Box>
                <IconButton
                  onClick={onClose}
                  disabled={isSaving}
                  sx={{ mt: -0.5, color: '#64748b' }}
                >
                  <Close />
                </IconButton>
              </Stack>
            </Box>

            <Divider />

            {isEditing ? (
              <Box
                sx={{
                  px: 3,
                  py: 2.5,
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid rgba(15,23,42,0.08)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                    mb: 1.5,
                  }}
                >
                  Event actions
                </Typography>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  spacing={2}
                  useFlexGap
                  flexWrap="wrap"
                >
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <PillButton onClick={onTogglePublish} disabled={isSaving}>
                      {formState.status === 'published'
                        ? 'Unlist'
                        : 'List / Publish'}
                    </PillButton>

                    <PillButton onClick={onToggleFeature} disabled={isSaving}>
                      {formState.featured ? 'Remove Featured' : 'Mark Featured'}
                    </PillButton>

                    <PillButton onClick={onMarkSoldOut} disabled={isSaving}>
                      Mark Sold Out
                    </PillButton>

                    <PillButton onClick={onCancelEvent} disabled={isSaving}>
                      Cancel Event
                    </PillButton>
                  </Stack>

                  <PillButton
                    color="error"
                    onClick={onDeleteEvent}
                    disabled={isSaving}
                    sx={{
                      color: 'error.main',
                      borderColor: 'rgba(220,38,38,0.28)',
                      '&:hover': {
                        backgroundColor: 'rgba(220,38,38,0.06)',
                      },
                    }}
                  >
                    Delete
                  </PillButton>
                </Stack>
              </Box>
            ) : null}

            <Box
              sx={{
                p: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                },
                '& .MuiFormLabel-root': {
                  fontWeight: 500,
                },
              }}
            >
              {isSaving ? (
                <Alert
                  severity="info"
                  icon={<CircularProgress size={18} color="inherit" />}
                  sx={{ mb: 2 }}
                >
                  {uploadImagesPending
                    ? 'Uploading event images...'
                    : 'Saving event changes...'}
                </Alert>
              ) : null}
            </Box>

            <Box sx={{ p: 3 }} component="form" onSubmit={onSubmit}>
              <Stack spacing={2.25}>
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                  }}
                >
                  Basic details
                </Typography>

                <TextField
                  label="Event title"
                  value={formState.title}
                  onChange={onFieldChange('title')}
                  fullWidth
                  required
                />
                <TextField
                  label="Short summary"
                  value={formState.summary}
                  onChange={onFieldChange('summary')}
                  fullWidth
                  required
                />
                <TextField
                  label="Full description"
                  value={formState.description}
                  onChange={onFieldChange('description')}
                  fullWidth
                  required
                  multiline
                  minRows={4}
                />

                <Typography
                  sx={{
                    pt: 1,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                  }}
                >
                  Media
                </Typography>

                <Stack
                  spacing={1.5}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: theme => `1px dashed ${theme.palette.divider}`,
                    backgroundColor: 'rgba(25, 118, 210, 0.03)',
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                  >
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadOutlined />}
                      disabled={isSaving}
                    >
                      {imageCount ? 'Add More Images' : 'Upload Images'}
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        multiple
                        onChange={onImageFilesChange}
                      />
                    </Button>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    Upload one or more JPG, PNG, WebP, or other image files up
                    to 10MB each. The first image is used as the cover on event
                    cards and hero sections.
                  </Typography>

                  {imageDrafts.length ? (
                    <Box
                      sx={{
                        display: 'grid',
                        gap: 1.5,
                        gridTemplateColumns: {
                          xs: 'repeat(2, minmax(0, 1fr))',
                          sm: 'repeat(3, minmax(0, 1fr))',
                        },
                      }}
                    >
                      {imageDrafts.map((imageDraft, index) => (
                        <Box
                          key={imageDraft.id}
                          sx={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: 3,
                            border: theme =>
                              `1px solid ${theme.palette.divider}`,
                            aspectRatio: '1 / 1',
                            backgroundColor: 'rgba(15,23,42,0.04)',
                          }}
                        >
                          <Box
                            component="img"
                            src={imageDraft.url}
                            alt={
                              formState.title
                                ? `${formState.title} image ${index + 1}`
                                : `Event image ${index + 1}`
                            }
                            sx={{
                              width: '100%',
                              height: '100%',
                              display: 'block',
                              objectFit: 'cover',
                            }}
                          />

                          <Stack
                            direction="row"
                            spacing={0.75}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              right: 8,
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <Chip
                              sx={{
                                color: index === 0 ? '#fff' : '#334155',
                                backgroundColor:
                                  index === 0
                                    ? 'primary.main'
                                    : 'rgba(255,255,255,0.88)',
                                borderColor:
                                  index === 0
                                    ? 'primary.main'
                                    : 'rgba(15,23,42,0.12)',
                              }}
                              label={
                                index === 0
                                  ? 'Cover'
                                  : imageDraft.type === 'new'
                                    ? 'New'
                                    : 'Saved'
                              }
                            />

                            <IconButton
                              size="small"
                              onClick={() => onRemoveImage(imageDraft.id)}
                              sx={{
                                backgroundColor: 'rgba(255,255,255,0.88)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255,255,255,1)',
                                },
                              }}
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          </Stack>

                          {index !== 0 ? (
                            <PillButton
                              type="button"
                              variant="contained"
                              onClick={() => onSetCoverImage(imageDraft.id)}
                              sx={{
                                position: 'absolute',
                                left: 8,
                                bottom: 8,
                                minWidth: 0,
                                px: 1.2,
                                py: 0.5,
                                backgroundColor: '#111827',
                                borderColor: '#111827',
                                color: '#fff',
                                '&:hover': {
                                  backgroundColor: '#1f2937',
                                  borderColor: '#1f2937',
                                },
                                boxShadow: 'none',
                              }}
                            >
                              Make Cover
                            </PillButton>
                          ) : null}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No event images uploaded yet.
                    </Typography>
                  )}
                </Stack>

                <Typography
                  sx={{
                    pt: 1,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                  }}
                >
                  Classification
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Category"
                      value={formState.category}
                      onChange={onFieldChange('category')}
                      fullWidth
                    >
                      {eventCategoryOptions.map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Status"
                      value={formState.status}
                      onChange={onFieldChange('status')}
                      fullWidth
                    >
                      {(
                        [
                          'published',
                          'draft',
                          'sold_out',
                          'cancelled',
                        ] as EventStatus[]
                      ).map(status => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <FormControlLabel
                  control={
                    <Switch
                      checked={formState.featured}
                      onChange={onFieldChange('featured')}
                    />
                  }
                  label="Feature this event on the guest page"
                />

                <Typography
                  sx={{
                    pt: 1,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                  }}
                >
                  Venue and schedule
                </Typography>

                <TextField
                  label="Organizer"
                  value={formState.organizer}
                  onChange={onFieldChange('organizer')}
                  fullWidth
                />
                <TextField
                  label="Venue name"
                  value={formState.venueName}
                  onChange={onFieldChange('venueName')}
                  fullWidth
                  required
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      value={formState.city}
                      onChange={onFieldChange('city')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Parish"
                      value={formState.parish}
                      onChange={onFieldChange('parish')}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Venue address"
                  value={formState.address}
                  onChange={onFieldChange('address')}
                  fullWidth
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Starts"
                      type="datetime-local"
                      value={formState.startDate}
                      onChange={onFieldChange('startDate')}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Ends"
                      type="datetime-local"
                      value={formState.endDate}
                      onChange={onFieldChange('endDate')}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                <Typography
                  sx={{
                    pt: 1,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                  }}
                >
                  Tickets and pricing
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={`${formState.generalTierName || 'Primary tier'} price`}
                      type="number"
                      value={formState.generalPrice}
                      onChange={onFieldChange('generalPrice')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={`${formState.generalTierName || 'Primary tier'} remaining`}
                      type="number"
                      value={formState.generalRemaining}
                      onChange={onFieldChange('generalRemaining')}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                {hiddenTicketTierCount > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {hiddenTicketTierCount} additional ticket
                    {hiddenTicketTierCount === 1
                      ? ' tier is'
                      : ' tiers are'}{' '}
                    attached to this event and will be preserved as-is.
                  </Typography>
                ) : null}

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={`${formState.vipTierName || 'Secondary tier'} price`}
                      type="number"
                      value={formState.vipPrice}
                      onChange={onFieldChange('vipPrice')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label={`${formState.vipTierName || 'Secondary tier'} remaining`}
                      type="number"
                      value={formState.vipRemaining}
                      onChange={onFieldChange('vipRemaining')}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Typography
                  sx={{
                    pt: 1,
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                  }}
                >
                  Discovery and promotion
                </Typography>

                <TextField
                  label="Tags"
                  value={formState.tags}
                  onChange={onFieldChange('tags')}
                  fullWidth
                  helperText="Comma-separated"
                />
                <TextField
                  label="Perks"
                  value={formState.perks}
                  onChange={onFieldChange('perks')}
                  fullWidth
                  helperText="Comma-separated"
                />
                <TextField
                  label="Lineup / speakers"
                  value={formState.lineup}
                  onChange={onFieldChange('lineup')}
                  fullWidth
                  helperText="Comma-separated"
                />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Coupon code"
                      value={formState.couponCode}
                      onChange={onFieldChange('couponCode')}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      label="Coupon headline"
                      value={formState.couponDiscount}
                      onChange={onFieldChange('couponDiscount')}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Coupon description"
                  value={formState.couponDescription}
                  onChange={onFieldChange('couponDescription')}
                  fullWidth
                />
                <TextField
                  label="Coupon expires"
                  type="datetime-local"
                  value={formState.couponExpires}
                  onChange={onFieldChange('couponExpires')}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="External ticket URL"
                  value={formState.ticketUrl}
                  onChange={onFieldChange('ticketUrl')}
                  fullWidth
                />
                <TextField
                  label="Event website"
                  value={formState.website}
                  onChange={onFieldChange('website')}
                  fullWidth
                />
                {formError ? (
                  <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => undefined}
                  >
                    {formError}
                  </Alert>
                ) : null}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSaving}
                >
                  {uploadImagesPending
                    ? 'Uploading Images...'
                    : isSaving
                      ? isEditing
                        ? 'Saving Changes...'
                        : 'Saving Event...'
                      : isEditing
                        ? 'Save Changes'
                        : 'Create Event'}
                </Button>

                {isEditing ? (
                  <Button
                    type="button"
                    variant="text"
                    onClick={onCancelEdit}
                    disabled={isSaving}
                  >
                    Cancel Edit
                  </Button>
                ) : null}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Drawer>
  );
}
