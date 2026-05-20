import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Plus,
  X,
  ChevronDown,
  Upload,
  Image as ImageIcon,
  Film,
  Star,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import {
  useDiameters,
  useCategories,
  useGrains,
  useCalibers,
} from '@/hooks/adminQueries';

interface PendingFile {
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
  thumbnail: boolean;
}

interface UploadedFile {
  url: string;
  path: string;
  type: 'image' | 'video';
  thumbnail?: boolean;
}

const MAX_FILES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export function AdminAddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  // Load from DB
  const { data: diameters = [] } = useDiameters();
  const { data: categories = [] } = useCategories();
  const { data: grains = [] } = useGrains();
  const { data: calibers = [] } = useCalibers();

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Ref for auto-hide success timeout
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [form, setForm] = useState({
    product_name: '',
    description: '',
    price: '',
    stocks: '',
    caliber: '',
    grains: '',
    diameter: '',
    category: '',
    featured: false,
  });

  // Pending files - stored locally, NOT uploaded yet
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setError(null);

    const remaining = MAX_FILES - pendingFiles.length;
    const filesToAdd = Array.from(selectedFiles).slice(0, remaining);

    if (filesToAdd.length < selectedFiles.length) {
      setError(
        `Maximum of ${MAX_FILES} files allowed. Only added ${remaining} more.`,
      );
    }

    // Validate file types
    for (const f of filesToAdd) {
      if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) {
        setError(
          `Invalid file type: ${f.name}. Only images and videos are supported.`,
        );
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (
        f.size > (f.type.startsWith('video/') ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE)
      ) {
        setError(
          `${f.type.startsWith('video/') ? 'Video' : 'Image'} file too large. Max ${f.type.startsWith('video/') ? '50MB' : '5MB'}.`,
        );
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    const newFiles: PendingFile[] = filesToAdd.map((f) => ({
      file: f,
      previewUrl: URL.createObjectURL(f),
      type: f.type.startsWith('video/') ? 'video' : 'image',
      thumbnail: false,
    }));

    setPendingFiles((prev) => {
      const updated = [...prev, ...newFiles];

      // Auto-set first image as thumbnail if none selected yet
      if (!updated.some((uf) => uf.thumbnail)) {
        const firstImage = updated.find((uf) => uf.type === 'image');
        if (firstImage) {
          firstImage.thumbnail = true;
        }
      }

      return updated;
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingFile = (index: number) => {
    const fileToRemove = pendingFiles[index];
    if (!fileToRemove) return;

    // Revoke blob URL to free memory
    URL.revokeObjectURL(fileToRemove.previewUrl);

    setPendingFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      // If we removed the thumbnail, set a new one
      if (fileToRemove.thumbnail && updated.length > 0) {
        const firstImage = updated.find((uf) => uf.type === 'image');
        if (firstImage) {
          firstImage.thumbnail = true;
        }
      }

      return updated;
    });
  };

  const setThumbnail = (index: number) => {
    setPendingFiles((prev) =>
      prev.map((f, i) => ({
        ...f,
        thumbnail: i === index,
      })),
    );
  };

  // Upload a single file to Supabase
  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    try {
      const isVideo = file.type.startsWith('video/');

      // Generate unique file name
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = `products/${fileName}`;

      console.log(
        '[AdminAddProduct] Uploading to bucket "primeshot":',
        filePath,
      );
      console.log(
        '[AdminAddProduct] File size:',
        (file.size / 1024).toFixed(1),
        'KB',
      );

      // Upload file directly (bucket should exist - if not, error will be caught)
      const { error: uploadError } = await supabase.storage
        .from('primeshot')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('[AdminAddProduct] Upload error details:', uploadError);
        return null;
      }

      console.log('[AdminAddProduct] Upload successful!');

      // Get public URL (works for public buckets)
      const { data: urlData } = supabase.storage
        .from('primeshot')
        .getPublicUrl(filePath);

      // Also get a signed URL as fallback
      const { data: signedData } = await supabase.storage
        .from('primeshot')
        .createSignedUrl(filePath, 31536000); // 1 year expiry

      const publicUrl = urlData.publicUrl;
      const signedUrl = signedData?.signedUrl;

      console.log('[AdminAddProduct] Public URL:', publicUrl);
      console.log('[AdminAddProduct] Signed URL:', signedUrl);

      // Use signed URL as fallback if public URL doesn't work
      const finalUrl = signedUrl || publicUrl;

      return {
        url: finalUrl,
        path: filePath,
        type: isVideo ? 'video' : 'image',
        thumbnail: false,
      };
    } catch (err) {
      console.error('[AdminAddProduct] Upload unexpected error:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDebugInfo(null);

    // Validate form
    if (!form.product_name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setError('Please enter a valid price');
      return;
    }
    if (!form.diameter) {
      setError('Please select a diameter');
      return;
    }
    if (!form.category) {
      setError('Please select a category');
      return;
    }
    if (pendingFiles.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setSubmitting(true);

    try {
      // === UPLOAD FILES NOW (on CTA click) ===
      const uploadedFiles: UploadedFile[] = [];
      for (const pf of pendingFiles) {
        const result = await uploadFile(pf.file);
        if (result) {
          result.thumbnail = pf.thumbnail;
          uploadedFiles.push(result);
        } else {
          const errMsg = `Failed to upload file: ${pf.file.name}. 

🔍 POSSIBLE FIX:
1️⃣ Go to Supabase Dashboard → Storage → Create bucket named "primeshot" (make it Public)
2️⃣ Or run the SQL from "supabase-add-media-columns.sql" in Supabase SQL Editor

Check browser console (F12) for error details.`;
          setError(errMsg);
          setSubmitting(false);
          return;
        }
      }

      // Build media arrays
      const imageUrls = uploadedFiles
        .filter((f) => f.type === 'image')
        .map((f) => f.url);
      const videoUrls = uploadedFiles
        .filter((f) => f.type === 'video')
        .map((f) => f.url);
      const thumbnailUrl =
        uploadedFiles.find((f) => f.thumbnail)?.url || imageUrls[0] || '';

      console.log('[AdminAddProduct] Image URLs to insert:', imageUrls);

      // Prepare insert data
      const insertData: Record<string, unknown> = {
        product_name: form.product_name,
        description: form.description,
        price: parseFloat(form.price),
        stocks: parseInt(form.stocks) || 0,
        caliber: form.caliber,
        grains: form.grains || '0',
        diameter: form.diameter,
        category: form.category,
        images: imageUrls,
        featured: form.featured,
      };

      // Try to add videos/thumbnail if columns exist
      try {
        const { data: colCheck } = await supabase
          .from('products')
          .select('videos')
          .limit(1);
        if (colCheck !== null) {
          insertData.videos = videoUrls;
          insertData.thumbnail = thumbnailUrl;
        }
      } catch {
        // columns don't exist - skip
      }

      // Insert product
      const { error: insertError } = await supabase
        .from('products')
        .insert(insertData);

      if (insertError) {
        console.error('[AdminAddProduct] Insert error:', insertError);
        setError(insertError.message);
        showToast(insertError.message, 'error');
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      showToast('Product added successfully!', 'success');
      // Reset form
      setForm({
        product_name: '',
        description: '',
        price: '',
        stocks: '',
        caliber: '',
        grains: '',
        diameter: '',
        category: '',
        featured: false,
      });
      // Clear pending files
      for (const pf of pendingFiles) {
        URL.revokeObjectURL(pf.previewUrl);
      }
      setPendingFiles([]);
      successTimeoutRef.current = setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      // Catch ANY unexpected error to prevent infinite loading state
      console.error('[AdminAddProduct] Unexpected error during submit:', err);
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
      clearTimeout(successTimeoutRef.current);
    }
  };

  const imageFiles = pendingFiles.filter((f) => f.type === 'image');
  const videoFiles = pendingFiles.filter((f) => f.type === 'video');
  const filesRemaining = MAX_FILES - pendingFiles.length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text-primary flex items-center gap-3">
          <Package className="w-6 h-6 text-primary-400" />
          Add New Product
        </h1>
        <p className="text-dark-text-secondary mt-1">
          Fill in the details below to add a new product to the store
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-900/20 border border-green-800 text-sm text-green-400 flex items-center gap-2">
          <span>✓</span>
          <span>Product added successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-800 text-sm text-red-400 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <pre className="whitespace-pre-wrap font-sans text-sm">{error}</pre>
        </div>
      )}

      {/* Debug Info */}
      {debugInfo && (
        <div className="mb-6 p-4 rounded-lg bg-blue-900/20 border border-blue-800 text-sm text-blue-400 flex items-start gap-2">
          <span>{debugInfo}</span>
          <button
            type="button"
            onClick={() => setDebugInfo(null)}
            className="ml-auto shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-dark-surface-secondary rounded-xl border border-dark-border p-6 space-y-6"
      >
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
            Product Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="product_name"
            value={form.product_name}
            onChange={handleChange}
            placeholder="e.g., Premium Pellets .22"
            className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Product description..."
            className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
          />
        </div>

        {/* Price & Stocks Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
              Price (₱) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
              Stocks
            </label>
            <input
              type="number"
              name="stocks"
              value={form.stocks}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Caliber, Grains, Diameter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
              Caliber
            </label>
            <div className="relative">
              <select
                name="caliber"
                value={form.caliber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 pr-8 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer"
              >
                <option value="">Select caliber...</option>
                {calibers.map((c) => (
                  <option key={c.id} value={c.value}>
                    {c.value}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-muted pointer-events-none" />
            </div>
          </div>
          {/* Grains - dropdown loaded from DB */}
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
              Grains
            </label>
            <div className="relative">
              <select
                name="grains"
                value={form.grains}
                onChange={handleChange}
                className="w-full px-4 py-2.5 pr-8 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer"
              >
                <option value="">Select grains...</option>
                {grains.map((g) => (
                  <option key={g.id} value={g.value}>
                    {g.value} gr
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-muted pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
              Diameter <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                name="diameter"
                value={form.diameter}
                onChange={handleChange}
                className="w-full px-4 py-2.5 pr-8 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm appearance-none cursor-pointer"
                required
              >
                <option value="">Select diameter...</option>
                {diameters.map((d) => (
                  <option key={d.id} value={d.value}>
                    {d.value}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category - loaded from DB */}
        <div>
          <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
            Category <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, category: cat.name }))
                }
                className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  form.category === cat.name
                    ? 'bg-primary-600/20 text-primary-400 border-primary-500/30'
                    : 'bg-dark-surface text-dark-text-secondary border-dark-border hover:border-primary-500/30 hover:text-dark-text-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
            {categories.length === 0 && (
              <p className="text-xs text-dark-text-muted col-span-full">
                No categories available. Add categories in the admin panel
                first.
              </p>
            )}
          </div>
        </div>

        {/* Media Upload Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-dark-text-primary">
              Product Media{' '}
              <span className="text-dark-text-muted font-normal">
                (Up to {MAX_FILES} files)
              </span>
            </label>
            {pendingFiles.length > 0 && (
              <span className="text-xs text-dark-text-muted">
                {pendingFiles.length}/{MAX_FILES} selected
              </span>
            )}
          </div>

          {/* Upload Area - JUST SELECTS FILES, does not upload */}
          <div
            onClick={() => filesRemaining > 0 && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              filesRemaining > 0
                ? 'border-dark-border hover:border-primary-500/50 hover:bg-primary-500/5'
                : 'border-dark-border/50 opacity-60 cursor-not-allowed'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-dark-text-muted mx-auto mb-3" />
            <p className="text-sm text-dark-text-secondary font-medium">
              {filesRemaining > 0
                ? 'Click to select images or videos'
                : 'Maximum files reached'}
            </p>
            <p className="text-xs text-dark-text-muted mt-1">
              Images: up to 5MB each &bull; Videos: up to 50MB each
            </p>
            <p className="text-xs text-dark-text-muted">
              Supported: JPG, PNG, WebP, GIF, MP4, WebM
            </p>
            <p className="text-xs text-primary-400 mt-2">
              Files will be uploaded when you click "Add Product"
            </p>
          </div>

          {/* File Previews (local only - not uploaded yet) */}
          {pendingFiles.length > 0 && (
            <div className="mt-4 space-y-3">
              {/* Image Previews */}
              {imageFiles.length > 0 && (
                <div>
                  <p className="text-xs text-dark-text-muted uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Images ({imageFiles.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {pendingFiles.map((file, index) => {
                      if (file.type !== 'image') return null;
                      return (
                        <div
                          key={index}
                          className={`relative group rounded-lg overflow-hidden border-2 ${
                            file.thumbnail
                              ? 'border-primary-500 ring-2 ring-primary-500/30'
                              : 'border-dark-border'
                          }`}
                        >
                          <img
                            src={file.previewUrl}
                            alt={`Product image ${index + 1}`}
                            className="w-full aspect-square object-cover"
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            {!file.thumbnail && file.type === 'image' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setThumbnail(index);
                                }}
                                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                                title="Set as thumbnail"
                              >
                                <Star className="w-4 h-4 text-white" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removePendingFile(index);
                              }}
                              className="p-1.5 rounded-lg bg-red-500/60 hover:bg-red-500/80 transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </button>
                          </div>

                          {/* Thumbnail badge */}
                          {file.thumbnail && (
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-primary-600 text-white text-[10px] font-bold flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              Thumbnail
                            </div>
                          )}

                          {/* File type + index */}
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px]">
                            {index + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Video Previews */}
              {videoFiles.length > 0 && (
                <div>
                  <p className="text-xs text-dark-text-muted uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" />
                    Videos ({videoFiles.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pendingFiles.map((file, index) => {
                      if (file.type !== 'video') return null;
                      return (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden border border-dark-border"
                        >
                          <video
                            src={file.previewUrl}
                            controls
                            className="w-full aspect-video bg-black"
                          />
                          <button
                            type="button"
                            onClick={() => removePendingFile(index)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/60 hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-dark-surface rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all border border-dark-border"></div>
          </label>
          <span className="text-sm text-dark-text-primary">
            Featured Product
          </span>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="px-5 py-2.5 rounded-lg border border-dark-border text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-surface-tertiary transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading & Adding Product...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
