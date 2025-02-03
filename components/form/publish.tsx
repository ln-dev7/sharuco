'use client';

import { useAuthContext } from '@/context/AuthContext';
import { useUpdateFormDocument } from '@/firebase/firestore/updateFormDocument';
import copyToClipboard from '@/utils/copyToClipboard.js';
import { algoliasearch } from 'algoliasearch';
import { Check, Eye, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PublishForms({ dataForm }: { dataForm: any }) {
  const params = useParams();
  const { user, userPseudo } = useAuthContext();

  const notifyUrlCopied = () =>
    toast.success('Url of your code copied to clipboard', {
      description: 'You can share it wherever you want',
    });

  const ALGOLIA_INDEX_NAME = 'forms';

  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY as string
  );
  const index = client.initIndex(ALGOLIA_INDEX_NAME);

  const {
    updateFormDocument,
    isLoading: isLoadingUpdateForm,
    isError: isErrorUpdateForm,
    isSuccess: isSuccessUpdateForm,
    reset: resetUpdateForm,
  }: any = useUpdateFormDocument('forms');

  const changeStatutOfForm = async () => {
    let updatedFormData: {
      published: boolean;
    } = {
      published: !dataForm?.published,
    };

    const id = params['form'];

    await updateFormDocument({ id, updatedFormData });

    await index.partialUpdateObject({
      objectID: id,
      published: !dataForm?.published,
    });
  };

  return (
    <div className="flex shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-300 py-20 dark:border-zinc-700">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 p-4 text-center">
        <Link
          href={`/form/view/${params['form']}`}
          target="_blank"
          className={buttonVariants({
            size: 'default',
            variant: 'subtle',
          })}
        >
          <Eye className="mr-2 h-4 w-4" />
          View form
        </Link>
        {dataForm.idAuthor === userPseudo && (
          <>
            <h3 className="text-md mt-4 font-semibold">
              {dataForm.published
                ? 'Your form is currently online and can be viewed and answered by anyone at the link'
                : 'Your form is not published so can only be seen by you alone'}
            </h3>
            <>
              {isLoadingUpdateForm ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <p
                  className="mb-4 mt-2 cursor-pointer text-sm font-semibold uppercase text-muted-foreground underline underline-offset-4"
                  onClick={() => changeStatutOfForm()}
                >
                  {!dataForm?.published ? 'Publish' : 'Unpublish'} your form
                </p>
              )}
            </>
          </>
        )}
        {isSuccessUpdateForm && (
          <div
            className="mb-2 flex w-full items-center rounded-lg bg-green-50 p-4 text-green-800 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">Info</span>
            <div className="ml-3 text-sm font-medium">
              Status of your form has been updated
            </div>
            <button
              type="button"
              className="-m-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 p-1.5 text-green-500 hover:bg-green-200 focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
              onClick={resetUpdateForm}
            >
              <span className="sr-only">Close</span>
              <X />
            </button>
          </div>
        )}
        <div className="flex w-full flex-col items-center gap-2 md:flex-row">
          <Input
            className="w-full"
            type="text"
            placeholder={`https://sharuco.lndev.me/form/view/${params['form']}`}
            value={`https://sharuco.lndev.me/form/view/${params['form']}`}
            disabled
          />
          <Button
            onClick={() => {
              copyToClipboard(
                `https://sharuco.lndev.me/form/view/${params['form']}`
              );
              notifyUrlCopied();
            }}
            className="w-full shrink-0 sm:w-fit"
          >
            Copy link
          </Button>
        </div>
      </div>
    </div>
  );
}
