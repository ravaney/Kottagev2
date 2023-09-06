import { createAsyncThunk } from "@reduxjs/toolkit";
import { ILoginCredentials } from "../components/types";
import { signInWithEmailAndPassword, auth, signOut, updateProfile, createUserWithEmailAndPassword, database
 } from '../firebase'
import { IInitUser, IUser } from "../../public/QuickType";
import { get, getDatabase, ref, set } from "firebase/database";
import {    getStorage,    ref as ref2,    uploadBytesResumable,    getDownloadURL,  } from "firebase/storage";
import { User, browserSessionPersistence, setPersistence } from "firebase/auth";
import { Kottage } from "./propertySlice";

export const loginAsync = createAsyncThunk('user/login',async(credentials:ILoginCredentials)=>{

const response = await signInWithEmailAndPassword(auth,credentials.email, credentials.password)
await setPersistence(auth, browserSessionPersistence)

const user = get(ref(database, 'users/' + response.user.uid))
.then((snapshot) => {
    if (snapshot.exists()) {
        console.log(snapshot.val());
        return snapshot.val()
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});


return user as IUser

})
export const signOutAsync = createAsyncThunk('user/logout', async() =>{
    signOut(auth);
    
})

export const getUserAsync = createAsyncThunk('user/getUser', async(uid:string) =>{     
        const data = get(ref(database, 'users/' + uid))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val() as IUser
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
        console.log(await data)
        return data as IUser  

})

export const updateProfileAsync = createAsyncThunk('user/updateProfile', async(user:any, profile:any)=>{
   const response = await  updateProfile(user,profile)
    return response
})

export const createAccountAsync = createAsyncThunk('user/createAccount', async(accountInfo:IInitUser)=>{
      
    await createUserWithEmailAndPassword(auth,accountInfo.email, accountInfo.password)
    //set browser persistence
    await setPersistence(auth, browserSessionPersistence)

    console.log("getting the current user ")
     await updateProfile(auth.currentUser as User, {displayName: accountInfo.email})
     console.log("updating the profile " + auth.currentUser?.displayName)
    
        accountInfo.image !== undefined &&
       await uploadBytesResumable(
            ref2(getStorage(), `profileImages/${accountInfo?.image[0].name}`),
            accountInfo.image[0]
          )
            .then((snapshot) => {
              getDownloadURL(snapshot.ref).then((url) => {
                set(ref(database, 'users/' + auth?.currentUser?.uid), {
                    photoUrl: url,
                    ...accountInfo,
                });            
                console.log(url);
                 updateProfile(auth.currentUser as User, {photoURL: url})
              });
            })
      
        const newUser = {
            email: accountInfo?.email ,
            emailVerified: auth?.currentUser?.emailVerified,
            isAnonymous: auth?.currentUser?.isAnonymous,
            uid:auth?.currentUser?.uid,
            phoneNumber: auth?.currentUser?.phoneNumber,
            photoURL: auth?.currentUser?.photoURL,
            firstName: accountInfo?.firstName,
            lastName: accountInfo?.lastName,
            address: accountInfo?.address,
            // dob: accountInfo?.dob,
        } as IUser

        await set(ref(database, 'users/' + auth?.currentUser?.uid), newUser);
        return newUser
})

export const addPropertyAsync = createAsyncThunk('user/addProperty', async({property,Files}:{property:Kottage, Files:File[]})=>{
    
    try{
        await set(ref(database, 'properties/' + property.id), property);
        await set(ref(database, 'users/' + auth?.currentUser?.uid +'/properties/'+property.id),{name: property.name, id:property.id})  
        Files.map(async(file:File)=>{
            console.log(file)
            const snapshot = await uploadBytesResumable(
                ref2(getStorage(), `propertyImages/${property.id}/${file.name}`),
                file
              )              
             await getDownloadURL(snapshot.ref).then((url) => {   
                //strip the file extension from the file name
                const fileName = file.name.split('.')[0]
                console.log({[fileName]: url})

                 set(ref(database, 'properties/' + property.id +'/images/'+fileName), url);
                console.log(url);
                    });
                })}    
                catch(error){
        console.log(error)
    }
    
})

//get my properties 
export const getMyPropertiesAsync = createAsyncThunk('user/getMyProperties', async()=>{

    //get all the property ids from the current user , then use thew ids to get the properties and return an array of properties
    const data = await get(ref(database, 'users/' + auth?.currentUser?.uid +'/properties/'))
    //extract only id value from each object in the array
    const propertyIds = Object.keys(data.val() as object)

    const properties = propertyIds.map(async(id:string)=>{
        const property = await get(ref(database, 'properties/' + id))  
        console.log(property.val()) 
        return property.val() as Kottage
    })
    const resolvedProperties = await Promise.all(properties)
    //remove all the null values from the array of properties
    const filteredProperties = resolvedProperties.filter((property)=>property !== null)
    return filteredProperties as Kottage[]
})

export const addImagesAsync = createAsyncThunk('user/addImages', async({images, propertyId}: {images:File[], propertyId:string})=>{
    const urls = images.map(async(image:File)=>{
       const imageUpload = await uploadBytesResumable(
            ref2(getStorage(), `propertyImages/${propertyId}/${image.name}`),
            image
          )                   
            .then((snapshot) => {
              getDownloadURL(snapshot.ref).then((url) => {
                console.log(url);
                 set(ref(database, 'properties/' + propertyId +'/images/'), urls);
                return url 
              });
            })
    })
    const resolvedUrls = await Promise.all(urls) 
    return resolvedUrls 
})