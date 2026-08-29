import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { AddCircleOutline, EditOutlined, Search } from '@mui/icons-material';
import {
  EventInput,
  EventRecord,
  EventStatus,
  EventTicketTier,
  getEventImageUrls,
  getEventLocationLabel,
  getEventPriceLabel,
  useAddEvent,
  useDeleteEvent,
  useEvents,
  useUpdateEvent,
  useUploadEventImages,
} from '../../hooks/eventHooks';
import EventEditorDrawer, {
  createDefaultFormState,
  EventFormState,
  EventImageDraft,
  NewEventImageDraft,
} from './EventEditDrawer';
import PillButton from '../common/PillButton';

const splitCommaValues = (value: string) =>
  value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

const joinCommaValues = (values: string[]) => values.join(', ');

const toIsoString = (value: string) => new Date(value).toISOString();
const maxEventImageSizeBytes = 10 * 1024 * 1024;
const createEventImageDraftId = () =>
  `event-image-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const formatDateTimeLocal = (value: string) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const timezoneOffset = parsedDate.getTimezoneOffset() * 60_000;
  return new Date(parsedDate.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
};

const isVipLikeTier = (tier: EventTicketTier) =>
  /vip|premium|gold|diamond/i.test(`${tier.id} ${tier.name}`);

const revokeImagePreviewUrls = (imageDrafts: EventImageDraft[]) => {
  imageDrafts.forEach(imageDraft => {
    if (imageDraft.type === 'new') {
      URL.revokeObjectURL(imageDraft.url);
    }
  });
};

const buildExistingImageDrafts = (imageUrls: string[]): EventImageDraft[] =>
  imageUrls.map(url => ({
    id: createEventImageDraftId(),
    type: 'existing',
    url,
  }));

const getEditableTicketTiers = (ticketTiers: EventTicketTier[]) => {
  const primaryTier =
    ticketTiers.find(tier => tier.id === 'general') ||
    ticketTiers.find(tier => !isVipLikeTier(tier)) ||
    ticketTiers[0];

  const secondaryTier =
    ticketTiers.find(
      tier => tier.id !== primaryTier?.id && tier.id === 'vip'
    ) ||
    ticketTiers.find(
      tier => tier.id !== primaryTier?.id && isVipLikeTier(tier)
    ) ||
    ticketTiers.find(tier => tier.id !== primaryTier?.id);

  return { primaryTier, secondaryTier };
};

const mapEventToFormState = (event: EventRecord): EventFormState => {
  const defaultFormState = createDefaultFormState();
  const { primaryTier, secondaryTier } = getEditableTicketTiers(
    event.ticketTiers
  );

  return {
    ...defaultFormState,
    title: event.title,
    summary: event.summary,
    description: event.description,
    category: event.category,
    status: event.status,
    featured: event.featured,
    organizer: event.organizer,
    venueName: event.venue.name,
    city: event.venue.city,
    parish: event.venue.parish,
    address: event.venue.address,
    startDate:
      formatDateTimeLocal(event.startDate) || defaultFormState.startDate,
    endDate: formatDateTimeLocal(event.endDate) || defaultFormState.endDate,
    generalTierId: primaryTier?.id || defaultFormState.generalTierId,
    generalTierName: primaryTier?.name || defaultFormState.generalTierName,
    generalTierPerks: primaryTier?.perks.length
      ? joinCommaValues(primaryTier.perks)
      : defaultFormState.generalTierPerks,
    generalPrice: primaryTier
      ? String(primaryTier.price)
      : defaultFormState.generalPrice,
    generalRemaining: primaryTier
      ? String(primaryTier.remaining)
      : defaultFormState.generalRemaining,
    vipTierId: secondaryTier?.id || defaultFormState.vipTierId,
    vipTierName: secondaryTier?.name || defaultFormState.vipTierName,
    vipTierPerks: secondaryTier?.perks.length
      ? joinCommaValues(secondaryTier.perks)
      : defaultFormState.vipTierPerks,
    vipPrice: secondaryTier ? String(secondaryTier.price) : '',
    vipRemaining: secondaryTier ? String(secondaryTier.remaining) : '',
    tags: joinCommaValues(event.tags),
    perks: joinCommaValues(event.perks),
    lineup: joinCommaValues(event.lineup),
    couponCode: event.coupon?.code || '',
    couponDescription: event.coupon?.description || '',
    couponDiscount: event.coupon?.discountText || '',
    couponExpires: event.coupon?.expiresAt
      ? formatDateTimeLocal(event.coupon.expiresAt)
      : formatDateTimeLocal(event.endDate) || defaultFormState.couponExpires,
    ticketUrl: event.ticketUrl || '',
    website: event.website || '',
  };
};

const buildTicketTiers = (
  formState: EventFormState,
  existingTiers: EventTicketTier[] = []
) => {
  const { primaryTier, secondaryTier } = getEditableTicketTiers(existingTiers);
  const preservedTiers = existingTiers.filter(
    tier => tier.id !== primaryTier?.id && tier.id !== secondaryTier?.id
  );
  const generalTierPerks = splitCommaValues(formState.generalTierPerks);
  const vipTierPerks = splitCommaValues(formState.vipTierPerks);

  const nextTiers: EventTicketTier[] = [
    {
      id: formState.generalTierId.trim() || primaryTier?.id || 'general',
      name:
        formState.generalTierName.trim() ||
        primaryTier?.name ||
        'General Admission',
      price: Number(formState.generalPrice || 0),
      remaining: Number(formState.generalRemaining || 0),
      perks: generalTierPerks.length
        ? generalTierPerks
        : primaryTier?.perks.length
          ? primaryTier.perks
          : ['General entry'],
    },
  ];

  if (formState.vipPrice.trim()) {
    nextTiers.push({
      id: formState.vipTierId.trim() || secondaryTier?.id || 'vip',
      name: formState.vipTierName.trim() || secondaryTier?.name || 'VIP',
      price: Number(formState.vipPrice || 0),
      remaining: Number(formState.vipRemaining || 0),
      perks: vipTierPerks.length
        ? vipTierPerks
        : secondaryTier?.perks.length
          ? secondaryTier.perks
          : ['VIP access', 'Premium perks'],
    });
  }

  return [
    ...nextTiers,
    ...preservedTiers.map(tier => ({
      ...tier,
      perks: [...tier.perks],
    })),
  ];
};

const formatStatusLabel = (status: EventStatus) => status.replace('_', ' ');

const statusPillSxMap = {
  published: {
    color: '#166534',
    backgroundColor: '#dcfce7',
    borderColor: '#bbf7d0',
  },
  draft: {
    color: '#92400e',
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  sold_out: {
    color: '#be123c',
    backgroundColor: '#ffe4e6',
    borderColor: '#fecdd3',
  },
  cancelled: {
    color: '#475569',
    backgroundColor: '#e2e8f0',
    borderColor: '#cbd5e1',
  },
};

const formatEventDateLabel = (event: EventRecord) => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Date TBA';
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return formatter.format(start);
  }

  return `${formatter.format(start)} – ${formatter.format(end)}`;
};

type ViewMode = 'table' | 'board';

function EventRow({
  event,
  isEditing,
  onEdit,
}: {
  event: EventRecord;
  isEditing: boolean;
  onEdit: (eventItem: EventRecord) => void;
}) {
  const imageUrl = getEventImageUrls(event)[0];

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: 2.25,
        borderBottom: '1px solid rgba(15,23,42,0.08)',
        '&:last-of-type': {
          borderBottom: 'none',
        },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} lg={3.25}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              component="img"
              src={imageUrl}
              alt={event.title}
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2.5,
                objectFit: 'cover',
                backgroundColor: 'rgba(15,23,42,0.06)',
                flexShrink: 0,
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: '#020617',
                  }}
                >
                  {event.title}
                </Typography>

                {event.featured ? (
                  <Chip
                    sx={{
                      color: '#6d28d9',
                      backgroundColor: '#ede9fe',
                      borderColor: '#ddd6fe',
                    }}
                    label="Featured"
                  />
                ) : null}

                {event.source === 'sample' ? <Chip label="Sample" /> : null}

                {isEditing ? (
                  <Chip
                    sx={{
                      color: '#075985',
                      backgroundColor: '#e0f2fe',
                      borderColor: '#bae6fd',
                    }}
                    label="Editing now"
                  />
                ) : null}
              </Stack>

              <Typography
                sx={{
                  fontSize: '0.9rem',
                  color: 'text.secondary',
                  lineHeight: 1,
                  mb: 0.25,
                }}
              >
                {event.summary}
              </Typography>

              <Typography
                sx={{
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                  fontWeight: 600,
                }}
              >
                Updated{' '}
                {new Date(
                  event.updatedAt || event.createdAt
                ).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={6} sm={4} lg={1.5}>
          <Chip
            sx={{
              ...statusPillSxMap[event.status],
              textTransform: 'capitalize',
              fontWeight: 700,
            }}
            label={formatStatusLabel(event.status)}
          />
        </Grid>

        <Grid item xs={6} sm={4} lg={1.75}>
          <Typography
            sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}
          >
            {formatEventDateLabel(event)}
          </Typography>
        </Grid>

        <Grid item xs={6} sm={4} lg={1.75}>
          <Typography sx={{ fontSize: '0.9rem', color: '#475569' }}>
            {getEventLocationLabel(event)}
          </Typography>
        </Grid>

        <Grid item xs={6} sm={4} lg={1.25}>
          <Typography
            sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#020617' }}
          >
            {getEventPriceLabel(event)}
          </Typography>
        </Grid>

        <Grid item xs={6} sm={4} lg={1.25}>
          <Typography sx={{ fontSize: '0.9rem', color: '#475569' }}>
            {event.status === 'draft'
              ? 'Not live'
              : event.status === 'sold_out'
                ? 'Sold out'
                : `${event.ticketTiers.reduce((sum, tier) => sum + tier.remaining, 0)} left`}
          </Typography>
        </Grid>

        <Grid item xs={12} lg={1.25}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent={{ lg: 'flex-end' }}
            useFlexGap
            flexWrap="nowrap"
            sx={{ whiteSpace: 'nowrap' }}
          >
            <PillButton
              variant="contained"
              startIcon={<EditOutlined />}
              onClick={() => onEdit(event)}
              sx={{
                backgroundColor: '#111827',
                borderColor: '#111827',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#1f2937',
                  borderColor: '#1f2937',
                },
                boxShadow: 'none',
                minWidth: 0,
                flexShrink: 0,
              }}
            >
              Edit
            </PillButton>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function EventManagement() {
  const [formState, setFormState] = React.useState<EventFormState>(
    createDefaultFormState
  );
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [editingEvent, setEditingEvent] = React.useState<EventRecord | null>(
    null
  );
  const [eventPendingDelete, setEventPendingDelete] =
    React.useState<EventRecord | null>(null);
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [imageDrafts, setImageDrafts] = React.useState<EventImageDraft[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [categoryFilter, setCategoryFilter] = React.useState('All');
  const [parishFilter, setParishFilter] = React.useState('All');
  const [viewMode, setViewMode] = React.useState<ViewMode>('table');

  const imageDraftsRef = React.useRef<EventImageDraft[]>([]);
  const { data: events = [] } = useEvents({
    includeDrafts: true,
    upcomingOnly: false,
  });
  const addEventMutation = useAddEvent();
  const updateEventMutation = useUpdateEvent();
  const uploadEventImagesMutation = useUploadEventImages();
  const deleteEventMutation = useDeleteEvent();

  const isEditing = Boolean(editingEvent);
  const isSaving =
    addEventMutation.isPending ||
    updateEventMutation.isPending ||
    uploadEventImagesMutation.isPending;

  const hiddenTicketTierCount = editingEvent
    ? Math.max(0, editingEvent.ticketTiers.length - 2)
    : 0;
  const imageCount = imageDrafts.length;

  const statusOptions = ['All', 'published', 'draft', 'sold_out', 'cancelled'];
  const categoryOptions = [
    'All',
    ...Array.from(new Set(events.map(event => event.category))),
  ];
  const parishOptions = [
    'All',
    ...Array.from(new Set(events.map(event => event.venue.parish))),
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      !searchTerm ||
      [
        event.title,
        event.summary,
        event.venue.name,
        event.venue.city,
        event.venue.parish,
        event.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || event.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'All' || event.category === categoryFilter;

    const matchesParish =
      parishFilter === 'All' || event.venue.parish === parishFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesParish;
  });

  const summaryItems = [
    {
      label: 'Total events',
      value: events.length,
      chip: 'Live',
      chipBg: '#e2e8f0',
      chipColor: '#1e293b',
    },
    {
      label: 'Published',
      value: events.filter(event => event.status === 'published').length,
      chip: 'Live',
      chipBg: '#dcfce7',
      chipColor: '#166534',
    },
    {
      label: 'Drafts',
      value: events.filter(event => event.status === 'draft').length,
      chip: 'Live',
      chipBg: '#fef3c7',
      chipColor: '#92400e',
    },
    {
      label: 'Sold out',
      value: events.filter(event => event.status === 'sold_out').length,
      chip: 'Live',
      chipBg: '#ffe4e6',
      chipColor: '#be123c',
    },
    {
      label: 'This weekend',
      value: events.filter(event => event.status === 'published').slice(0, 9)
        .length,
      chip: 'Live',
      chipBg: '#e0f2fe',
      chipColor: '#075985',
    },
  ];

  const handleChange =
    (field: keyof EventFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        field === 'featured'
          ? (event.target as HTMLInputElement).checked
          : event.target.value;

      setFormState(prev => ({
        ...prev,
        [field]: value,
      }));
    };

  React.useEffect(() => {
    imageDraftsRef.current = imageDrafts;
  }, [imageDrafts]);

  React.useEffect(
    () => () => {
      revokeImagePreviewUrls(imageDraftsRef.current);
    },
    []
  );

  const handleImageFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';

    if (!files.length) {
      return;
    }

    const invalidFile = files.find(file => !file.type.startsWith('image/'));

    if (invalidFile) {
      setFormError('Please choose image files only for event photos.');
      return;
    }

    const oversizedFile = files.find(
      file => file.size > maxEventImageSizeBytes
    );

    if (oversizedFile) {
      setFormError('Event images need to be 10MB or smaller.');
      return;
    }

    const nextImageDrafts: EventImageDraft[] = files.map(file => ({
      id: createEventImageDraftId(),
      type: 'new',
      file,
      url: URL.createObjectURL(file),
    }));

    setImageDrafts(prev => [...prev, ...nextImageDrafts]);
    setFormError(null);
  };

  const handleRemoveImage = (imageDraftId: string) => {
    setImageDrafts(prev => {
      const imageDraft = prev.find(item => item.id === imageDraftId);

      if (imageDraft?.type === 'new') {
        URL.revokeObjectURL(imageDraft.url);
      }

      return prev.filter(item => item.id !== imageDraftId);
    });
  };

  const handleSetCoverImage = (imageDraftId: string) => {
    setImageDrafts(prev => {
      const imageDraft = prev.find(item => item.id === imageDraftId);

      if (!imageDraft) {
        return prev;
      }

      return [imageDraft, ...prev.filter(item => item.id !== imageDraftId)];
    });
  };

  const resetForm = () => {
    setFormState(createDefaultFormState());
    setEditingEvent(null);
    setFormError(null);
    setImageDrafts(prev => {
      revokeImagePreviewUrls(prev);
      return [];
    });
  };

  const handleAddStart = () => {
    resetForm();
    setFeedback(null);
    setIsEditorOpen(true);
  };

  const handleEditStart = (eventItem: EventRecord) => {
    if (eventItem.source === 'sample') {
      return;
    }

    setEditingEvent(eventItem);
    setFormState(mapEventToFormState(eventItem));
    setImageDrafts(prev => {
      revokeImagePreviewUrls(prev);
      return buildExistingImageDrafts(getEventImageUrls(eventItem));
    });
    setFormError(null);
    setFeedback(null);
    setIsEditorOpen(true);
  };

  const handleEditCancel = () => {
    resetForm();
    setIsEditorOpen(false);
  };

  const handleEditorClose = () => {
    if (isSaving) {
      return;
    }

    resetForm();
    setIsEditorOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !formState.title.trim() ||
      !formState.summary.trim() ||
      !formState.description.trim() ||
      !formState.venueName.trim()
    ) {
      setFormError('Please complete the main event details before saving.');
      return;
    }

    const startDate = new Date(formState.startDate);
    const endDate = new Date(formState.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      setFormError('Please provide a valid start and end time for the event.');
      return;
    }

    if (endDate.getTime() <= startDate.getTime()) {
      setFormError('The event end time needs to be later than the start time.');
      return;
    }

    if (formState.couponCode.trim()) {
      const couponExpiry = new Date(formState.couponExpires);

      if (Number.isNaN(couponExpiry.getTime())) {
        setFormError('Please provide a valid coupon expiration date.');
        return;
      }
    }

    if (!imageDrafts.length) {
      setFormError('Please upload at least one image for this event.');
      return;
    }

    try {
      setFormError(null);
      const newImageDrafts = imageDrafts.filter(
        (imageDraft): imageDraft is NewEventImageDraft =>
          imageDraft.type === 'new'
      );

      const uploadedImageUrls = newImageDrafts.length
        ? await uploadEventImagesMutation.mutateAsync(
            newImageDrafts.map(imageDraft => imageDraft.file)
          )
        : [];

      if (uploadedImageUrls.length !== newImageDrafts.length) {
        throw new Error('Not every event image produced a download URL.');
      }

      const uploadedImageUrlMap = new Map<string, string>(
        newImageDrafts.map((imageDraft, index) => [
          imageDraft.id,
          uploadedImageUrls[index] || '',
        ])
      );

      const finalImageUrls = imageDrafts
        .map(imageDraft =>
          imageDraft.type === 'existing'
            ? imageDraft.url
            : uploadedImageUrlMap.get(imageDraft.id) || ''
        )
        .filter(Boolean);

      if (finalImageUrls.length !== imageDrafts.length) {
        throw new Error('One or more event images could not be prepared.');
      }

      const payload: EventInput = {
        title: formState.title.trim(),
        summary: formState.summary.trim(),
        description: formState.description.trim(),
        images: finalImageUrls,
        startDate: toIsoString(formState.startDate),
        endDate: toIsoString(formState.endDate),
        category: formState.category,
        status: formState.status,
        featured: formState.featured,
        organizer: formState.organizer.trim() || 'Yaad Events',
        venue: {
          name: formState.venueName.trim(),
          city: formState.city.trim(),
          parish: formState.parish.trim(),
          address: formState.address.trim(),
        },
        tags: splitCommaValues(formState.tags),
        perks: splitCommaValues(formState.perks),
        lineup: splitCommaValues(formState.lineup),
        ticketTiers: buildTicketTiers(formState, editingEvent?.ticketTiers),
        coupon: formState.couponCode
          ? {
              code: formState.couponCode.trim(),
              description: formState.couponDescription.trim(),
              discountText: formState.couponDiscount.trim(),
              expiresAt: toIsoString(formState.couponExpires),
            }
          : undefined,
        ticketUrl: formState.ticketUrl.trim() || undefined,
        website: formState.website.trim() || undefined,
      };

      if (editingEvent) {
        await updateEventMutation.mutateAsync({
          eventId: editingEvent.id,
          updates: payload,
        });
        setFeedback(`"${payload.title}" was updated successfully.`);
      } else {
        await addEventMutation.mutateAsync(payload);
        setFeedback('Event scaffold created successfully.');
      }

      resetForm();
      setIsEditorOpen(false);
    } catch (error) {
      console.error(error);
      setFormError(
        isEditing
          ? 'We could not update the event right now.'
          : 'We could not save the event right now.'
      );
    }
  };

  const handleQuickEventUpdate = async (
    updates: Partial<Pick<EventInput, 'featured' | 'status'>>,
    successMessage: string
  ) => {
    if (!editingEvent) {
      return;
    }

    try {
      setFormError(null);
      await updateEventMutation.mutateAsync({
        eventId: editingEvent.id,
        updates,
      });

      setFormState(prev => ({
        ...prev,
        ...updates,
      }));
      setEditingEvent(prev =>
        prev
          ? {
              ...prev,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : prev
      );
      setFeedback(successMessage);
    } catch (error) {
      console.error(error);
      setFormError('We could not update the event right now.');
    }
  };

  const handleTogglePublish = () => {
    const nextStatus: EventStatus =
      formState.status === 'published' ? 'draft' : 'published';

    void handleQuickEventUpdate(
      { status: nextStatus },
      `"${formState.title}" was ${nextStatus === 'published' ? 'published' : 'moved to draft'}.`
    );
  };

  const handleToggleFeature = () => {
    const nextFeatured = !formState.featured;

    void handleQuickEventUpdate(
      { featured: nextFeatured },
      `"${formState.title}" was ${nextFeatured ? 'marked featured' : 'removed from featured events'}.`
    );
  };

  const handleMarkSoldOut = () => {
    void handleQuickEventUpdate(
      { status: 'sold_out' },
      `"${formState.title}" was marked sold out.`
    );
  };

  const handleCancelEvent = () => {
    void handleQuickEventUpdate(
      { status: 'cancelled' },
      `"${formState.title}" was cancelled.`
    );
  };

  const handleDeleteEventStart = () => {
    if (!editingEvent) {
      return;
    }

    setEventPendingDelete(editingEvent);
  };

  const handleDeleteDialogClose = () => {
    if (deleteEventMutation.isPending) {
      return;
    }

    setEventPendingDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!eventPendingDelete) {
      return;
    }

    try {
      await deleteEventMutation.mutateAsync(eventPendingDelete.id);
      setFeedback(`"${eventPendingDelete.title}" was deleted permanently.`);
      if (editingEvent?.id === eventPendingDelete.id) {
        resetForm();
        setIsEditorOpen(false);
      }
      setEventPendingDelete(null);
    } catch (error) {
      console.error(error);
      setFeedback('We could not delete the event right now.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f6f7fb',
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#64748b',
              }}
            >
              Admin / Events
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontSize: { xs: '2.2rem', md: '3rem' },
                fontWeight: 900,
                letterSpacing: '-0.04em',
                color: '#020617',
              }}
            >
              Event management
            </Typography>
            <Typography
              sx={{ mt: 1.5, maxWidth: 760, color: '#475569', lineHeight: 1.9 }}
            >
              Manage listings, publishing, featured placement, and ticket
              readiness from one operational dashboard.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
            <PillButton>Export CSV</PillButton>
            <PillButton
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={handleAddStart}
              sx={{
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
              Create Event
            </PillButton>
          </Stack>
        </Box>

        {feedback ? (
          <Alert
            severity="info"
            sx={{ mb: 3, borderRadius: 3 }}
            onClose={() => setFeedback(null)}
          >
            {feedback}
          </Alert>
        ) : null}

        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            border: '1px solid rgba(15,23,42,0.08)',
            boxShadow: '0 14px 30px rgba(15,23,42,0.05)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' },
            }}
          >
            {summaryItems.map((item, index) => (
              <Box
                key={item.label}
                sx={{
                  px: 2.5,
                  py: 2,
                  borderRight: {
                    md:
                      index !== summaryItems.length - 1
                        ? '1px solid rgba(15,23,42,0.08)'
                        : 'none',
                  },
                  borderBottom: {
                    xs:
                      index !== summaryItems.length - 1
                        ? '1px solid rgba(15,23,42,0.08)'
                        : 'none',
                    md: 'none',
                  },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#64748b',
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 1,
                        fontSize: '1.7rem',
                        fontWeight: 900,
                        letterSpacing: '-0.02em',
                        color: '#020617',
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                  <Chip
                    sx={{
                      fontWeight: 800,
                      color: item.chipColor,
                      backgroundColor: item.chipBg,
                      borderColor: 'transparent',
                    }}
                    label="Live"
                  />
                </Stack>
              </Box>
            ))}
          </Box>
        </Card>

        <Card
          sx={{
            borderRadius: 3.5,
            border: '1px solid rgba(15,23,42,0.08)',
            boxShadow: '0 18px 40px rgba(15,23,42,0.06)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 2.25,
              mr: { xs: 0, lg: 1.5 },
              borderBottom: '1px solid rgba(15,23,42,0.08)',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} lg={4}>
                <TextField
                  fullWidth
                  placeholder="Search by title, venue, or tag"
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: '#f8fafc',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={2}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={statusFilter}
                  onChange={event => setStatusFilter(event.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: '#f8fafc',
                    },
                  }}
                >
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>
                      {status === 'All'
                        ? status
                        : formatStatusLabel(status as EventStatus)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={2}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={categoryFilter}
                  onChange={event => setCategoryFilter(event.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: '#f8fafc',
                    },
                  }}
                >
                  {categoryOptions.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={2}>
                <TextField
                  fullWidth
                  select
                  label="Parish"
                  value={parishFilter}
                  onChange={event => setParishFilter(event.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: '#f8fafc',
                    },
                  }}
                >
                  {parishOptions.map(parish => (
                    <MenuItem key={parish} value={parish}>
                      {parish}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={3} lg={1.5}>
                <TextField
                  fullWidth
                  select
                  label="View"
                  value={viewMode}
                  onChange={event =>
                    setViewMode(event.target.value as ViewMode)
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: '#f8fafc',
                    },
                  }}
                >
                  <MenuItem value="table">Table</MenuItem>
                  <MenuItem value="board">Board</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>

          {viewMode === 'table' ? (
            <>
              <Box
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  px: 3,
                  py: 2,
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid rgba(15,23,42,0.08)',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item lg={3.25}>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#64748b',
                      }}
                    >
                      Event
                    </Typography>
                  </Grid>
                  <Grid item lg={1.5}>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#64748b',
                      }}
                    >
                      Status
                    </Typography>
                  </Grid>
                  <Grid item lg={1.75}>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#64748b',
                      }}
                    >
                      Date
                    </Typography>
                  </Grid>
                  <Grid item lg={1.75}>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#64748b',
                      }}
                    >
                      Location
                    </Typography>
                  </Grid>
                  <Grid item lg={1.25}>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#64748b',
                      }}
                    >
                      Pricing
                    </Typography>
                  </Grid>
                  <Grid item lg={1.25}>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#64748b',
                      }}
                    >
                      Sales
                    </Typography>
                  </Grid>
                  <Grid item lg={1.25}>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: '#64748b',
                        textAlign: 'right',
                      }}
                    >
                      Actions
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {filteredEvents.length ? (
                filteredEvents.map(event => (
                  <EventRow
                    key={event.id}
                    event={event}
                    isEditing={editingEvent?.id === event.id}
                    onEdit={handleEditStart}
                  />
                ))
              ) : (
                <CardContent sx={{ py: 8, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    No events match those filters.
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Try widening the search or selecting a different
                    status/category.
                  </Typography>
                </CardContent>
              )}
            </>
          ) : (
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {(['draft', 'published', 'sold_out'] as EventStatus[]).map(
                  columnStatus => {
                    const columnEvents = filteredEvents.filter(
                      event => event.status === columnStatus
                    );

                    return (
                      <Grid item xs={12} md={4} key={columnStatus}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            border: '1px solid rgba(15,23,42,0.08)',
                            boxShadow: '0 14px 34px rgba(15,23,42,0.05)',
                            height: '100%',
                          }}
                        >
                          <CardContent sx={{ p: 2.5 }}>
                            <Typography
                              sx={{
                                fontSize: '1rem',
                                fontWeight: 800,
                                color: '#334155',
                                textTransform: 'capitalize',
                              }}
                            >
                              {formatStatusLabel(columnStatus)}
                            </Typography>

                            <Stack spacing={1.5} sx={{ mt: 2 }}>
                              {columnEvents.length ? (
                                columnEvents.map(event => (
                                  <Box
                                    key={event.id}
                                    sx={{
                                      p: 2,
                                      borderRadius: 3,
                                      border: '1px solid rgba(15,23,42,0.08)',
                                      backgroundColor: '#fff',
                                      boxShadow:
                                        '0 6px 18px rgba(15,23,42,0.04)',
                                    }}
                                  >
                                    <Typography
                                      sx={{ fontWeight: 700, color: '#020617' }}
                                    >
                                      {event.title}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        mt: 0.75,
                                        fontSize: '0.9rem',
                                        color: '#64748b',
                                      }}
                                    >
                                      {event.summary}
                                    </Typography>
                                    <Button
                                      size="small"
                                      variant="text"
                                      onClick={() => handleEditStart(event)}
                                      sx={{
                                        mt: 1,
                                        p: 0,
                                        minWidth: 0,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  </Box>
                                ))
                              ) : (
                                <Typography sx={{ color: 'text.secondary' }}>
                                  No events in this column.
                                </Typography>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  }
                )}
              </Grid>
            </CardContent>
          )}
        </Card>

        <EventEditorDrawer
          open={isEditorOpen}
          isSaving={isSaving}
          isEditing={isEditing}
          editingEvent={editingEvent}
          formState={formState}
          formError={formError}
          imageDrafts={imageDrafts}
          imageCount={imageCount}
          hiddenTicketTierCount={hiddenTicketTierCount}
          uploadImagesPending={uploadEventImagesMutation.isPending}
          onClose={handleEditorClose}
          onCancelEdit={handleEditCancel}
          onSubmit={handleSubmit}
          onFieldChange={handleChange}
          onImageFilesChange={handleImageFilesChange}
          onRemoveImage={handleRemoveImage}
          onSetCoverImage={handleSetCoverImage}
          onTogglePublish={handleTogglePublish}
          onToggleFeature={handleToggleFeature}
          onMarkSoldOut={handleMarkSoldOut}
          onCancelEvent={handleCancelEvent}
          onDeleteEvent={handleDeleteEventStart}
        />

        <Dialog
          open={!!eventPendingDelete}
          onClose={handleDeleteDialogClose}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Delete Event Permanently?</DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">
              {eventPendingDelete
                ? `This will permanently remove "${eventPendingDelete.title}" from the database.`
                : 'This will permanently remove this event from the database.'}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Drafting or cancelling keeps the event for records. Deletion
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteDialogClose}
              disabled={deleteEventMutation.isPending}
            >
              Keep Event
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleteEventMutation.isPending}
            >
              {deleteEventMutation.isPending
                ? 'Deleting...'
                : 'Delete Permanently'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
