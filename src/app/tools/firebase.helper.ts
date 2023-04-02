import { collection, Firestore, getDocs, orderBy, query } from 'firebase/firestore';

export abstract class FirebaseHelper {
  static select = async (firestoreRef: Firestore, collectionName: string): Promise<any[]> => {
    const reference = collection(firestoreRef, collectionName);
    const docQuery = query(reference, orderBy('slug'));
    const querySnapshot = await getDocs(docQuery);

    const documents: any[] = [];
    querySnapshot.forEach((docSnapshot: any) => {
      documents.push(docSnapshot.data());
    });
    return documents;
  }
}
