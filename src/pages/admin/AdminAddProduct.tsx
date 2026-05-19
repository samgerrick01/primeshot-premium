import { useState, useEffect, useRef } from 'react';
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
  Check,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';

interface Diameter {
  id: number;
  value: string;
}

interface UploadedFile {
  url: string;
  path: string;
  type: 'image' | 'video';
  thumbnail?: boolean;
}

const PRODUCT_CATEGORIES = [
  'Pellets',
  'Slugs',
  'Diabolo',
  'Hollow Point',
  'Match Grade',
  'Accessories',
];

const MAX_FILES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export function AdminAddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const [diameters, setDiameters] = useState<Diameter[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);

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

  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    fetchDiameters();
  }, []);

  const fetchDiameters = async () => {
    const { data, error } = await supabase
      .from('diameters')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('[AdminAddProduct] fetch diameters error:', error);
    } else {
      setDiameters(data || []);
    }
  };

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

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      setError(
        `${isVideo ? 'Video' : 'Image'} file too large. Max ${isVideo ? '50MB' : '5MB'}.`,
      );
      return null;
    }

    // Generate unique file name
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('primeshot')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[AdminAddProduct] upload error:', uploadError);
      setError(`Failed to upload ${file.name}: ${uploadError.message}`);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('primeshot')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
      type: isVideo ? 'video' : 'image',
      thumbnail: false,
    };
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setError(null);
    setUploadingFiles(true);

    const remaining = MAX_FILES - files.length;
    const filesToUpload = Array.from(selectedFiles).slice(0, remaining);

    if (filesToUpload.length < selectedFiles.length) {
      setError(
        `Maximum of ${MAX_FILES} files allowed. Only added ${remaining} more.`,
      );
    }

    // Validate file types
    for (const f of filesToUpload) {
      if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) {
        setError(
          `Invalid file type: ${f.name}. Only images and videos are supported.`,
        );
        setUploadingFiles(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    const uploaded: UploadedFile[] = [];
    for (const f of filesToUpload) {
      const result = await uploadFile(f);
      if (result) {
        uploaded.push(result);
      }
    }

    setFiles((prev) => {
      const updated = [...prev, ...uploaded];

      // Auto-set first image as thumbnail if none selected yet
      if (!updated.some((uf) => uf.thumbnail)) {
        const firstImage = updated.find((uf) => uf.type === 'image');
        if (firstImage) {
          firstImage.thumbnail = true;
        }
      }

      return updated;
    });

    setUploadingFiles(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = async (index: number) => {
    const fileToRemove = files[index];
    if (!fileToRemove) return;

    // Delete from storage
    await supabase.storage.from('primeshot').remove([fileToRemove.path]);

    setFiles((prev) => {
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
    setFiles((prev) =>
      prev.map((f, i) => ({
        ...f,
        thumbnail: i === index,
      })),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Validate
    if (!form.product_name.trim()) {
      setError('Product name is required');
      setSubmitting(false);
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setError('Please enter a valid price');
      setSubmitting(false);
      return;
    }
    if (!form.diameter) {
      setError('Please select a diameter');
      setSubmitting(false);
      return;
    }
    if (!form.category) {
      setError('Please select a category');
      setSubmitting(false);
      return;
    }

    // Build images as array of URLs + track thumbnail
    const imageUrls = files.filter((f) => f.type === 'image').map((f) => f.url);
    const videoUrls = files.filter((f) => f.type === 'video').map((f) => f.url);
    const thumbnailUrl =
      files.find((f) => f.thumbnail)?.url || imageUrls[0] || '';

    const { error: insertError } = await supabase.from('products').insert({
      product_name: form.product_name,
      description: form.description,
      price: parseFloat(form.price),
      stocks: parseInt(form.stocks) || 0,
      caliber: form.caliber,
      grains: parseFloat(form.grains) || 0,
      diameter: form.diameter,
      category: form.category,
      images: imageUrls,
      videos: videoUrls,
      thumbnail: thumbnailUrl,
      featured: form.featured,
    });

    if (insertError) {
      console.error('[AdminAddProduct] insert error:', insertError);
      setError(insertError.message);
      showToast(insertError.message, 'error');
    } else {
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
      setFiles([]);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSubmitting(false);
  };

  const imageFiles = files.filter((f) => f.type === 'image');
  const videoFiles = files.filter((f) => f.type === 'video');
  const filesRemaining = MAX_FILES - files.length;

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
          <span className="mt-0.5">⚠</span>
          <span>{error}</span>
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
            <input
              type="text"
              name="caliber"
              value={form.caliber}
              onChange={handleChange}
              placeholder="e.g., 4.5mm"
              className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
              Grains
            </label>
            <input
              type="number"
              name="grains"
              value={form.grains}
              onChange={handleChange}
              placeholder="0.0"
              step="0.1"
              min="0"
              className="w-full px-4 py-2.5 rounded-lg border border-dark-border bg-dark-surface text-dark-text-primary placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
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

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-dark-text-primary mb-1.5">
            Category <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                  form.category === cat
                    ? 'bg-primary-600/20 text-primary-400 border-primary-500/30'
                    : 'bg-dark-surface text-dark-text-secondary border-dark-border hover:border-primary-500/30 hover:text-dark-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
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
            {files.length > 0 && (
              <span className="text-xs text-dark-text-muted">
                {files.length}/{MAX_FILES} used
              </span>
            )}
          </div>

          {/* Upload Area / Dropzone */}
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
                ? 'Click to upload images or videos'
                : 'Maximum files reached'}
            </p>
            <p className="text-xs text-dark-text-muted mt-1">
              Images: up to 5MB each &bull; Videos: up to 50MB each
            </p>
            <p className="text-xs text-dark-text-muted">
              Supported: JPG, PNG, WebP, GIF, MP4, WebM
            </p>
          </div>

          {/* Uploading Indicator */}
          {uploadingFiles && (
            <div className="flex items-center gap-2 mt-3 text-sm text-primary-400">
              <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
              Uploading files...
            </div>
          )}

          {/* File Previews */}
          {files.length > 0 && (
            <div className="mt-4 space-y-3">
              {/* Image Previews */}
              {imageFiles.length > 0 && (
                <div>
                  <p className="text-xs text-dark-text-muted uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Images ({imageFiles.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {files.map((file, index) => {
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
                            src={file.url}
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
                                removeFile(index);
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
                    {files.map((file, index) => {
                      if (file.type !== 'video') return null;
                      return (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden border border-dark-border"
                        >
                          <video
                            src={file.url}
                            controls
                            className="w-full aspect-video bg-black"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
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
            disabled={submitting || uploadingFiles}
            className="flex-1 px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding Product...
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
