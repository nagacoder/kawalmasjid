import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  AvatarAuto,
  ButtonLink,
  Layout,
  PageHeader,
  RemixLink,
} from "~/components";
import { model } from "~/models";
import {
  createCacheHeaders,
  createMetaData,
  createSitemap,
  formatRelativeTime,
  truncateText,
} from "~/utils";

import type { LoaderArgs } from "@remix-run/node";
import { Plus } from "~/icons";

export const handle = createSitemap("/places", 0.8);

export const meta = createMetaData({
  title: "Semua masjid",
  description: "Seluruh data masjid yang telah dikumpulkan.",
});

export async function loader({ request }: LoaderArgs) {
  const places = await model.place.query.getAll({ limit: 10 });
  const placesCount = await model.place.query.count();

  return json(
    { places, placesCount },
    { headers: createCacheHeaders(request) }
  );
}

export default function Route() {
  const { places, placesCount } = useLoaderData<typeof loader>();

  return (
    <Layout
      isSpaced
      variant="sm"
      layoutHeader={
        <PageHeader size="xs">
          <div className="contain-sm stack">
            <div>
              <h1>Semua masjid</h1>
              <p>Seluruh {placesCount} data masjid yang telah dikumpulkan.</p>
            </div>
            <div className="queue-center">
              <ButtonLink to="/new" size="sm">
                <Plus className="size-sm" />
                <span>Tambah Masjid</span>
              </ButtonLink>
            </div>
          </div>
        </PageHeader>
      }
    >
      <section>
        <ul className="space-y-2">
          {places.map((place) => {
            return (
              <li key={place.slug}>
                <RemixLink
                  prefetch="intent"
                  to={`/places/${place.slug}`}
                  className="card hover:card-hover flex h-full flex-col space-y-0"
                >
                  <h3>{place.name}</h3>
                  <p className="dim">{truncateText(place.description, 120)}</p>
                  <div className="queue-center dim">
                    <AvatarAuto user={place.user} className="size-md" />
                    <b>{place.user.name}</b>
                    <span>•</span>
                    <span>{formatRelativeTime(place.updatedAt)}</span>
                  </div>
                </RemixLink>
              </li>
            );
          })}
        </ul>
      </section>
    </Layout>
  );
}
