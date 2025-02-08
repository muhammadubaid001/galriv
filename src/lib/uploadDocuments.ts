import { supabase } from "./supabase"

export default async function updateProfileDocument(
    file: File,
    documentType: 'operating' | 'profit_split' | 'withdrawal',
  ) {
    try {
      // Get the current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const userId = user?.id
      // Simplify the file path structure
      const filePath = `${documentType}/${userId}_${Date.now()}.pdf`
      
      // Upload file
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('documents')  // your bucket name
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })
      
      if (storageError) throw storageError
  
      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('documents')
        .getPublicUrl(filePath)

      // Update profile with the new URL
      const urlColumn = documentType === 'withdrawal' 
        ? 'withdrawal_terms_url' 
        : `${documentType}_agreement_url`
  
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ [urlColumn]: publicUrl })
        .eq('id', userId)
        .single()
  
      if (updateError) throw updateError
  
      return { data, publicUrl }
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  }