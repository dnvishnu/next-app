// src/services/assistantservice.js

import axios from "axios";
import { db } from "@/app/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const submitConfiguration = async (id, data) => {
  const configuration = {
    assistantTitle: data.assistantTitle,
    assistantDescription: data.assistantDescription,
    assistantLogo: data.assistantLogo,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    customApiKey: data.customApiKey,
  };

  try {
    const siteRef = doc(db, "domains", id); // Reference to the document in the "domains" collection

    // Pass the configuration map directly to updateDoc
    await updateDoc(siteRef, {
      configuration: configuration, // Place the configuration map as the value for "configuration" field
    });

    toast.success("Assistant configuration submitted");
  } catch (error) {
    console.error("Error updating document:", error);
    toast.error("Failed to update data");
  }
};

const submitUserProfileQuestions = async (id, userProfileQuestions) => {
  if (!userProfileQuestions || userProfileQuestions.length === 0) {
    toast.error("Select an appropriate CSV.");
    return; // Exit if no questions are provided
  }

  try {
    // Reference to the document in the "domains" collection, using the provided user ID
    const userRef = doc(db, "domains", id); // Replace "domains" with the correct collection name

    // Overwrite the userProfileQuestions map in Firestore with the new data
    await updateDoc(userRef, {
      userProfileQuestions: userProfileQuestions, // Replace existing data with the new data
    });

    toast.success("User profile questions submitted");
  } catch (error) {
    console.error("Error submitting user profile questions:", error);
    toast.error("Failed to submit profile questions.");
  }
};

const submitPromptSettings = async (id, promptId, promptSettings) => {
  if (!promptId || !promptSettings) {
    toast.error("Invalid prompt library or settings.");
    return;
  }

  try {
    const userRef = doc(db, "domains", id);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      toast.error("Domain not found.");
      return;
    }

    let promptLibrary = docSnap.data().promptLibrary || [];

    // Check if the library already exists
    const existingIndex = promptLibrary.findIndex(
      (lib) => lib.id === promptId
    );

    if (existingIndex !== -1) {
      // Update existing prompt settings
      promptLibrary[existingIndex].promptSettings = promptSettings;
    } else {
      // Add new entry
      promptLibrary.push({ name: promptId, promptSettings });
    }

    // Update Firestore
    await updateDoc(userRef, { promptLibrary });

    toast.success("Prompt settings submitted successfully");
  } catch (error) {
    console.error("Error submitting prompt settings:", error);
    toast.error("Failed to submit prompt settings.");
  }
};

const submitPromptLibrary = async (id, promptLibrary) => {
  try {
    // Reference to the document in the "domains" collection, using the provided user ID
    const userRef = doc(db, "domains", id); // Replace "domains" with the correct collection name

    // Overwrite the promptLibrary map in Firestore with the new data
    await updateDoc(userRef, {
      promptLibrary: promptLibrary, // Replace existing data with the new data
    });

    toast.success("Prompt library submitted successfully");
  } catch (error) {
    console.error("Error submitting system variables:", error);
    toast.error("Failed to submit variables.");
  }
};

const fetchPromptSettings = async (id, promptId) => {
  try {
    const siteRef = doc(db, "domains", id);
    const siteDoc = await getDoc(siteRef);

    if (!siteDoc.exists()) return null;

    const promptLibrary = siteDoc.data().promptLibrary || [];

    // Find the prompt object by name
    const prompt = promptLibrary.find((p) => p.id === promptId);

    return prompt ? prompt.promptSettings : null; // Return settings if found, else null
  } catch (error) {
    console.error("Error fetching prompt settings:", error);
    return null;
  }
};

const fetchConfiguration = async (id) => {
  try {
    const siteRef = doc(db, "domains", id); // Reference to the document in the "domains" collection
    const siteDoc = await getDoc(siteRef); // Fetch the document

    if (siteDoc.exists()) {
      // Document exists, retrieve the configuration field
      const configuration = siteDoc.data().configuration;
      if (configuration) {
        return configuration; // Return the configuration data
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching configuration:", error);
    return null;
  }
};

const fetchPromptLibrary = async (id) => {
  try {
    const siteRef = doc(db, "domains", id); // Reference to the document in the "domains" collection
    const siteDoc = await getDoc(siteRef); // Fetch the document

    if (siteDoc.exists()) {
      // Document exists, retrieve the configuration field
      const library = siteDoc.data().promptLibrary;
      if (library) {
        return library; // Return the settings data
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};

const uploadFile = async (formData) => {
  try {
    const response = await axios.post(
      "https://bucket-upload-auth-vtoo6mbt4q-uc.a.run.app/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.success("File uploaded successfully!");
  } catch (error) {
    console.error("Error submitting file:", error.message);
    toast.error(
      "Error uploading file: " +
        (error.response ? error.response.data.message : error.message)
    );
    throw error; // Rethrow the error for further handling if needed
  }
};

const uploadGdrive = async (formData) => {
  try {
    const response = await axios.post(
      "https://gdrive2-api-315740774339.us-central1.run.app/gdrive",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    toast.success("Google drive link submitted");
    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error submitting file:", error);
    toast.error(
      "Error uploading file: " +
        (error.response ? error.response.data.message : error.message)
    );
    throw error; // Rethrow the error for further handling if needed
  }
};

const fetchToken = async (cloud) => {
  try {
    let url = "https://bucket-upload-auth-vtoo6mbt4q-uc.a.run.app/jwt";
    if (cloud === "azure") {
      url = "https://bucket-upload-auth-vtoo6mbt4q-uc.a.run.app/azjwt";
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    // Handle error (e.g., display a message to the user)
  }
};

const assistantService = {
  fetchConfiguration,
  fetchPromptSettings,
  fetchPromptLibrary,
  submitUserProfileQuestions,
  submitConfiguration,
  submitPromptSettings,
  submitPromptLibrary,
  uploadFile,
  uploadGdrive,
  fetchToken,
};

export default assistantService;
