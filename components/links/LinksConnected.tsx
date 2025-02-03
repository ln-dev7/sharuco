'use client';

import { useAuthContext } from '@/context/AuthContext';
import { useGetDocumentFromUser } from '@/firebase/firestore/getDocumentFromUser';
import { FileCog, Layers } from 'lucide-react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import CardLinkAdmin from '@/components/cards/card-link-admin';
import EmptyCard from '@/components/empty-card';
import LoaderLinks from '@/components/loaders/loader-links';

export default function LinksConnected() {
  const { user, userPseudo } = useAuthContext();

  const {
    isLoading: isLoadingLinks,
    isError: isErrorLinks,
    data: dataLinks,
  } = useGetDocumentFromUser(userPseudo, 'links');

  return (
    <>
      {isLoadingLinks && <LoaderLinks />}
      {dataLinks && (
        <>
          {dataLinks.length > 0 && (
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                659: 1,
                660: 2,
                720: 2,
                990: 3,
              }}
              className="w-full"
            >
              <Masonry gutter="2rem">
                {dataLinks.map(
                  (link: {
                    id: string;
                    idAuthor: string;
                    link: string;
                    description: string;
                    tags: string[];
                    createdAt: any;
                  }) => (
                    <CardLinkAdmin
                      key={link.id}
                      id={link.id}
                      idAuthor={link.idAuthor}
                      link={link.link}
                      description={link.description}
                      tags={link.tags}
                      createdAt={link.createdAt}
                    />
                  )
                )}
              </Masonry>
            </ResponsiveMasonry>
          )}
          {dataLinks.length == 0 && (
            <EmptyCard
              icon={<Layers className="h-12 w-12" />}
              title="No link found"
              description="You have not added any link yet."
            />
          )}
        </>
      )}
      {isErrorLinks && (
        <EmptyCard
          icon={<FileCog className="h-12 w-12" />}
          title="An error has occurred"
          description="An error has occurred, please try again later or refresh the page."
        />
      )}
    </>
  );
}
