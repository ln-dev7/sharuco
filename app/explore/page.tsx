"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { addCodesOnAlgolia } from "@/algolia/addCodesOnAlgolia";
import { NBR_OF_CODES_PER_PAGE } from "@/constants/nbr-codes.js";
import { useAuthContext } from "@/context/AuthContext";
import { useGetCodesWithLanguage } from "@/firebase/firestore/getCodesWithLanguage";
import { useGetCodesWithTag } from "@/firebase/firestore/getCodesWithTag";
import { useDocument } from "@/firebase/firestore/getDocument";
import {
  getIsPrivateCodeWithPagination,
  useGetIsPrivateCodeWithPagination,
} from "@/firebase/firestore/getIsPrivateCodeWithPagination";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import CardCode from "@/components/cards/card-code";
import Error from "@/components/error";
import { Layout } from "@/components/layout";
import LoaderCode from "@/components/loaders/loader-code";
import LoaderCodes from "@/components/loaders/loader-codes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Explore() {
  const { user, userPseudo } = useAuthContext();

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(userPseudo, "users");

  const [currentData, setCurrentData] = useState(null);
  const [lastDocc, setLastDocc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const {
    isLoading: isLoadingPublicCodes,
    isError: isErrorPublicCodes,
    data,
  } = useGetIsPrivateCodeWithPagination(false);

  useEffect(() => {
    if (data) {
      setCurrentData(data.collections);
      setLastDocc(data.lastDoc);
    }
  }, [data]);

  const fetchMorePublicCodes = async () => {
    const { collections, lastDoc: newLastDoc } =
      await getIsPrivateCodeWithPagination(false, lastDocc);
    setLastDocc(newLastDoc);
    setCurrentData([...currentData, ...collections]);
    if (collections.length < NBR_OF_CODES_PER_PAGE) {
      setHasMore(false);
    }
  };

  const [tagSelected, setTagSelected] = useState(false);
  const [languageSelected, setLanguageSelected] = useState(false);

  const { getCodesWithTag, isLoading: isLoadingWithTag } = useGetCodesWithTag();

  const fetchCodesWithTag = async (tag) => {
    setTagSelected(true);
    setLanguageSelected(false);
    if (tag === "all") {
      setCurrentData(data.collections);
      setHasMore(true);
      setTagSelected(false);
      return data.collections;
    }
    const collections = await getCodesWithTag(tag, false);
    setCurrentData(collections);
    setHasMore(false);
    return collections;
  };

  const { getCodesWithLanguage, isLoading: isLoadingWithLanguage } =
    useGetCodesWithLanguage();

  const fetchCodesWithLanguage = async (language) => {
    setTagSelected(false);
    setLanguageSelected(true);
    if (language === "all") {
      setCurrentData(data.collections);
      setHasMore(true);
      setLanguageSelected(false);
      return data.collections;
    }
    const collections = await getCodesWithLanguage(language, false);
    setCurrentData(collections);
    setHasMore(false);
    return collections;
  };

  return (
    <Layout>
      <Head>
        <title>Sharuco | Explore Code</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>{" "}
      <section className="container grid items-center gap-8 pb-8 pt-6 md:py-10">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            Discover little bits of code that can help you.
          </h1>
          <div className="mt-2 flex w-full flex-col justify-end gap-2 lg:flex-row">
            <div className="flex flex-row gap-2">
              <div className="relative flex w-full items-center justify-center">
                {languageSelected && (
                  <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-sky-500"></span>
                )}
                <Select
                  onValueChange={(value) => fetchCodesWithLanguage(value)}
                >
                  <SelectTrigger className="w-full lg:w-[240px]">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Languages</SelectLabel>
                      <SelectItem value="all">All languages</SelectItem>
                      {data && data.collections && (
                        <>
                          {data.collections
                            .map((code: any) => code.language)
                            .filter(
                              (language: any, index: any, self: any) =>
                                self.indexOf(language) === index
                            )
                            .sort((a: any, b: any) => a.localeCompare(b))
                            .map((language) => (
                              <SelectItem key={language} value={language}>
                                {language}
                              </SelectItem>
                            ))}
                        </>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative flex w-full items-center justify-center">
                {tagSelected && (
                  <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-sky-500"></span>
                )}
                <Select onValueChange={(value) => fetchCodesWithTag(value)}>
                  <SelectTrigger className="w-full lg:w-[240px]">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tags</SelectLabel>
                      <SelectItem value="all">All tags</SelectItem>
                      {data && data.collections && (
                        <>
                          {data.collections
                            .map((code: any) => code.tags)
                            .flat()
                            .filter(
                              (tag: any, index: any, self: any) =>
                                self.indexOf(tag) === index
                            )
                            .sort((a: any, b: any) => a.localeCompare(b))
                            .map((tag) => (
                              <SelectItem
                                key={tag.replace(/\s+/g, "")}
                                value={tag}
                              >
                                {tag}
                              </SelectItem>
                            ))}
                        </>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          {/* {isLoadingPublicCodes && <Loader />} */}
          {currentData && !isLoadingWithTag && !isLoadingWithLanguage ? (
            <InfiniteScroll
              dataLength={currentData.length}
              next={fetchMorePublicCodes}
              hasMore={!isLoadingPublicCodes && hasMore}
              loader={
                currentData.length >= NBR_OF_CODES_PER_PAGE && <LoaderCode />
              }
              className="scrollbar-hide"
              style={{
                overflow: "visible",
              }}
            >
              <ResponsiveMasonry
                columnsCountBreakPoints={{
                  659: 1,
                  660: 1,
                  720: 1,
                  1200: 2,
                }}
                className="w-full"
              >
                <Masonry gutter="2rem">
                  {currentData.map(
                    (code: {
                      id: string;
                      idAuthor: string;
                      language: string;
                      code: string;
                      description: string;
                      tags: string[];
                      favoris: string[];
                      isPrivate: boolean;
                      currentUser: any;
                      comments: any;
                    }) => (
                      <CardCode
                        key={code.id}
                        id={code.id}
                        idAuthor={code.idAuthor}
                        language={code.language}
                        code={code.code}
                        description={code.description}
                        tags={code.tags}
                        favoris={code.favoris}
                        isPrivate={code.isPrivate}
                        currentUser={dataUser?.data}
                        comments={code.comments}
                      />
                    )
                  )}
                </Masonry>
              </ResponsiveMasonry>
            </InfiniteScroll>
          ) : (
            <LoaderCodes />
          )}
          {isErrorPublicCodes && <Error />}
        </div>
      </section>
    </Layout>
  );
}
