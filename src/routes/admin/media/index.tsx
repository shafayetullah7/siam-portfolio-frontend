import { Title } from "@solidjs/meta";
import { createSignal } from "solid-js";
import AdminPageHeader from "~/components/admin/AdminPageHeader";
import MediaLibraryBrowser from "~/components/admin/media/MediaLibraryBrowser";
import MediaMetadataPanel from "~/components/admin/media/MediaMetadataPanel";
import MediaUploadZone from "~/components/admin/media/MediaUploadZone";
import EmptyState from "~/components/EmptyState";
import type { MediaAdmin } from "~/lib/api/types/admin.types";

export default function AdminMediaLibrary() {
  const [selectedId, setSelectedId] = createSignal<string | null>(null);
  const [refreshKey, setRefreshKey] = createSignal(0);

  function onUploaded(item: MediaAdmin) {
    setRefreshKey((k) => k + 1);
    setSelectedId(item.id);
  }

  return (
    <div>
      <Title>Media library — SIAM Admin</Title>
      <AdminPageHeader
        title="Media library"
        description="Upload and manage images and PDFs for your site."
      />

      <div class="mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(280px,320px)]">
        <div class="min-w-0 space-y-4">
          <MediaUploadZone onUploaded={onUploaded} />
          <MediaLibraryBrowser
            selectedId={selectedId()}
            onSelect={setSelectedId}
            refreshKey={refreshKey()}
            emptyFallback={
              <EmptyState
                variant="list"
                title="No files yet"
                description="Upload an image or PDF to build your library."
              >
                <div class="max-w-md">
                  <MediaUploadZone onUploaded={onUploaded} />
                </div>
              </EmptyState>
            }
          />
        </div>

        <MediaMetadataPanel
          mediaId={selectedId()}
          onUpdated={() => setRefreshKey((k) => k + 1)}
          onDeleted={() => {
            setSelectedId(null);
            setRefreshKey((k) => k + 1);
          }}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}
