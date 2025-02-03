'use client';

import { useAuthContext } from '@/context/AuthContext';
import { useDocument } from '@/firebase/firestore/getDocument';
import { useGetDocumentFromUser } from '@/firebase/firestore/getDocumentFromUser';
import {
  FileQuestion,
  Loader2,
  MessageSquare,
  Send,
  Settings2,
} from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import Error from '@/components/error';
import PublishForms from '@/components/form/publish';
import QuestionsForms from '@/components/form/questions';
import ResponsesForms from '@/components/form/responses';
import SettingsForms from '@/components/form/settings';
import { Layout } from '@/components/layout';
import { buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FormPage() {
  const params = useParams();
  const { user, userPseudo } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/forms');
    }
  });

  const {
    data: dataForm,
    isLoading: isLoadingForm,
    isError: isErrorForm,
    error: errorForm,
  }: {
    data: any;
    isLoading: boolean;
    isError: boolean;
    error: any;
  } = useDocument(params['form'], 'forms');

  const goToForm = (id) => {
    router.push(`/form/${id}`);
  };

  const {
    isLoading: isLoadingForms,
    isError: isErrorForms,
    data: dataForms,
  } = useGetDocumentFromUser(userPseudo, 'forms');

  return (
    <Layout>
      <Head>
        <title>Sharuco | Form : {params['form']}</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>{' '}
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        {isLoadingForm && (
          <div className="flex w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        )}
        {dataForm &&
          dataForm.exists &&
          (dataForm.data.idAuthor === userPseudo ||
            dataForm.data.collaborators.some(
              (item) => item.pseudo === userPseudo
            )) && (
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row">
                <div className="flex flex-col items-start gap-2">
                  <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
                    {dataForm.data.name}
                  </h1>
                  <p className="text-sm font-medium leading-5 text-gray-500 sm:text-base md:text-lg lg:text-lg dark:text-gray-400">
                    {dataForm.data.description}
                  </p>
                </div>
                {dataForm.data.idAuthor === userPseudo ? (
                  <div className="md:mtb-0 mb-3">
                    <Select onValueChange={(value) => goToForm(value)}>
                      <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select a form" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Your Forms</SelectLabel>
                          {dataForms.map((form) => (
                            <SelectItem key={form.id} value={form.id}>
                              {form.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="">
                    <span className="italic">
                      Created by{' '}
                      <a
                        className="font-bold underline underline-offset-2"
                        href={`/user/${dataForm.data.idAuthor}`}
                      >
                        @ {dataForm.data.idAuthor}
                      </a>
                    </span>
                  </div>
                )}
              </div>
              <Tabs defaultValue="questions" className="w-full">
                <TabsList>
                  <div>
                    <TabsTrigger value="questions">
                      <FileQuestion className="mr-2 h-4 w-4" />
                      Questions
                    </TabsTrigger>
                    <TabsTrigger value="responses">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Responses
                      <span className="ml-2 flex items-center justify-center rounded-md bg-zinc-200 px-1 dark:bg-zinc-700">
                        {dataForm.data.responses.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="publish">
                      <Send className="mr-2 h-4 w-4" />
                      Publish
                    </TabsTrigger>
                    {dataForm.data.idAuthor === userPseudo && (
                      <TabsTrigger value="settings">
                        <Settings2 className="mr-2 h-4 w-4" />
                        Settings
                      </TabsTrigger>
                    )}
                  </div>
                </TabsList>
                <TabsContent className="border-none p-0 pt-4" value="questions">
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      659: 1,
                      660: 1,
                      720: 1,
                      1200: 1,
                    }}
                    className="w-full"
                  >
                    <Masonry gutter="1rem">
                      <QuestionsForms dataForm={dataForm.data} />
                    </Masonry>
                  </ResponsiveMasonry>
                </TabsContent>
                <TabsContent className="border-none p-0 pt-2" value="responses">
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      659: 1,
                      660: 1,
                      720: 1,
                      1200: 1,
                    }}
                    className="w-full"
                  >
                    <Masonry gutter="1rem">
                      <ResponsesForms dataForm={dataForm.data} />
                    </Masonry>
                  </ResponsiveMasonry>
                </TabsContent>
                <TabsContent className="border-none p-0 pt-2" value="publish">
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      659: 1,
                      660: 1,
                      720: 1,
                      1200: 1,
                    }}
                    className="w-full"
                  >
                    <Masonry gutter="1rem">
                      <PublishForms dataForm={dataForm.data} />
                    </Masonry>
                  </ResponsiveMasonry>
                </TabsContent>
                {dataForm.data.idAuthor === userPseudo && (
                  <TabsContent
                    className="border-none p-0 pt-2"
                    value="settings"
                  >
                    <ResponsiveMasonry
                      columnsCountBreakPoints={{
                        659: 1,
                        660: 1,
                        720: 1,
                        1200: 1,
                      }}
                      className="w-full"
                    >
                      <Masonry gutter="1rem">
                        <SettingsForms dataForm={dataForm.data} />
                      </Masonry>
                    </ResponsiveMasonry>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}
        {((dataForm && !dataForm.exists) ||
          (dataForm &&
            dataForm.exists &&
            dataForm.data.idAuthor !== userPseudo &&
            dataForm.data.collaborators.some(
              (item) => item.pseudo !== userPseudo
            ))) && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">This form does not exist.</h1>
            <Link
              href="/forms"
              className={buttonVariants({ size: 'lg', variant: 'outline' })}
            >
              Create your own form
            </Link>
          </div>
        )}
        {isErrorForm && (
          <>
            {errorForm.message == 'Missing or insufficient permissions.' ? (
              <div className="flex flex-col items-center gap-4">
                <h1 className="text-2xl font-bold">
                  This form does not exist.
                </h1>
                <Link
                  href="/forms"
                  className={buttonVariants({ size: 'lg', variant: 'outline' })}
                >
                  Create your own form
                </Link>
              </div>
            ) : (
              <Error />
            )}
          </>
        )}
      </section>
    </Layout>
  );
}
