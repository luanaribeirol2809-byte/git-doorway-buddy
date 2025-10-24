import { supabase } from '@/integrations/supabase/client';

export const useStorage = () => {
  const uploadFile = async (
    bucket: string,
    file: File,
    path?: string
  ): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      return !error;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  };

  const getPublicUrl = (bucket: string, path: string): string => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  };

  return {
    uploadFile,
    deleteFile,
    getPublicUrl,
  };
};

export default useStorage;