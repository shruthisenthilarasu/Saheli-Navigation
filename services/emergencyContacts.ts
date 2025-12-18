import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyContact } from '../types/sos';

/**
 * Emergency Contacts Service
 * Manages emergency contacts stored locally
 */

const STORAGE_KEY = '@saheli:emergency_contacts';

/**
 * Get all emergency contacts
 */
export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading emergency contacts:', error);
    return [];
  }
}

/**
 * Save emergency contacts
 */
export async function saveEmergencyContacts(contacts: EmergencyContact[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  } catch (error) {
    console.error('Error saving emergency contacts:', error);
    throw error;
  }
}

/**
 * Add an emergency contact
 */
export async function addEmergencyContact(contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> {
  const contacts = await getEmergencyContacts();
  const newContact: EmergencyContact = {
    ...contact,
    id: Date.now().toString(), // Simple ID generation
  };
  contacts.push(newContact);
  await saveEmergencyContacts(contacts);
  return newContact;
}

/**
 * Remove an emergency contact
 */
export async function removeEmergencyContact(contactId: string): Promise<void> {
  const contacts = await getEmergencyContacts();
  const filtered = contacts.filter((c) => c.id !== contactId);
  await saveEmergencyContacts(filtered);
}

/**
 * Update an emergency contact
 */
export async function updateEmergencyContact(
  contactId: string,
  updates: Partial<EmergencyContact>
): Promise<EmergencyContact> {
  const contacts = await getEmergencyContacts();
  const index = contacts.findIndex((c) => c.id === contactId);
  if (index === -1) {
    throw new Error('Contact not found');
  }
  contacts[index] = { ...contacts[index], ...updates };
  await saveEmergencyContacts(contacts);
  return contacts[index];
}

/**
 * Get primary emergency contact
 */
export async function getPrimaryContact(): Promise<EmergencyContact | null> {
  const contacts = await getEmergencyContacts();
  return contacts.find((c) => c.isPrimary) || contacts[0] || null;
}

