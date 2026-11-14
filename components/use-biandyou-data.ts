"use client";

import { useCallback, useEffect, useState } from "react";
import { DATA_EVENT, discussionsRepo, eventsRepo, membersRepo, projectsRepo, resourcesRepo } from "@/lib/data";

export function useDataRefresh() {
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    window.addEventListener(DATA_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(DATA_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, [bump]);

  return version;
}

export function useMembers() {
  const v = useDataRefresh();
  const [data, setData] = useState<ReturnType<typeof membersRepo.list>>([]);
  useEffect(() => setData(membersRepo.list()), [v]);
  return data;
}

export function useEvents() {
  const v = useDataRefresh();
  const [data, setData] = useState<ReturnType<typeof eventsRepo.list>>([]);
  useEffect(() => setData(eventsRepo.list()), [v]);
  return data;
}

export function useProjects() {
  const v = useDataRefresh();
  const [data, setData] = useState<ReturnType<typeof projectsRepo.list>>([]);
  useEffect(() => setData(projectsRepo.list()), [v]);
  return data;
}

export function useDiscussions() {
  const v = useDataRefresh();
  const [data, setData] = useState<ReturnType<typeof discussionsRepo.list>>([]);
  useEffect(() => setData(discussionsRepo.list()), [v]);
  return data;
}

export function useResources() {
  const v = useDataRefresh();
  const [data, setData] = useState<ReturnType<typeof resourcesRepo.list>>([]);
  useEffect(() => setData(resourcesRepo.list()), [v]);
  return data;
}
