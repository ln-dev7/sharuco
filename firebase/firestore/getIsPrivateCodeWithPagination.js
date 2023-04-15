import {
    collection,
    getDocs,
    getFirestore,
    orderBy,
    query,
    startAfter,
    where,
    limit,
  } from "firebase/firestore"
  import InfiniteScroll from "react-infinite-scroll-component"
  import { useQuery } from "react-query"
  
  import firebase_app from "../config"
  
  const db = getFirestore(firebase_app)
  
  const PAGE_SIZE = 15
  
  const getIsPrivateCodeWithPagination = async (isPrivate, lastDoc) => {
    let codesQuery = query(
      collection(db, "codes"),
      where("isPrivate", "==", isPrivate),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    )
  
    if (lastDoc) {
      codesQuery = query(
        collection(db, "codes"),
        where("isPrivate", "==", isPrivate),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      )
    }
  
    const querySnapshot = await getDocs(codesQuery)
  
    const collections = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      data.id = doc.id
      return data
    })
  
    return {
      collections,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
    }
  }
  
  const useGetIsPrivateCodeWithPagination = (isPrivate) => {
    return useQuery([`isprivate-codes-${isPrivate}`], async () => {
      const { collections, lastDoc } = await getIsPrivateCodeWithPagination(isPrivate)
      return { collections, lastDoc }
    })
  }
  
  export { useGetIsPrivateCodeWithPagination, getIsPrivateCodeWithPagination }
  