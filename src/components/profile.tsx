"use client";

import { useSession } from "next-auth/react";

export default function Profile() {
  const session = useSession();
  console.log(session);
  if (session.data?.user) {
    return <div>From client: user is signed in</div>;
  }

  return <div>From client: user is NOT signed out</div>;
}
