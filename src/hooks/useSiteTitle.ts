import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSiteTitle = () => {
  const [siteTitle, setSiteTitle] = useState<string>("MARCOS MÁQUINAS E FERRAMENTAS");

  useEffect(() => {
    const fetchSiteTitle = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("site_title")
        .maybeSingle();
      
      if (data?.site_title) {
        setSiteTitle(data.site_title);
        document.title = data.site_title;
      }
    };

    fetchSiteTitle();
  }, []);

  return siteTitle;
};
