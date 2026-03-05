"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";
import { useAuth } from "@/context/auth-context";
import { useTranslations } from "next-intl";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const t = useTranslations("profile");
  const tRoles = useTranslations("roles");

  const USER = {
    name: user?.name ?? "User",
    email: user?.email ?? "",
    role: user?.roleDisplayName ?? "",
    level: user?.roleLevel ?? "",
    img: "/images/user/user-03.png",
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">{t("myAccount")}</span>

        <figure className="flex items-center gap-3">
          <Image
            src={USER.img}
            className="size-12"
            alt={`Avatar of ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <div className="text-left">
              <span className="block">{USER.name}</span>
              {USER.role && (
                <span className="block text-xs font-normal text-dark-5 dark:text-dark-6">
                  {USER.role}
                </span>
              )}
            </div>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">{t("userInformation")}</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={USER.img}
            className="size-12"
            alt={`Avatar for ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />

          <figcaption className="space-y-1.5 text-base font-medium">
            <div className="leading-none text-dark dark:text-white">
              {USER.name}
            </div>

            <div className="text-sm leading-none text-gray-6">{USER.email}</div>

            {USER.role && (
              <div className="flex items-center gap-1.5">
                <span className="inline-block rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary dark:bg-primary/20">
                  {USER.role}
                </span>
                {USER.level && (
                  <span className="text-xs text-dark-5 dark:text-dark-6">
                    {tRoles(`roleLevel_${USER.level}`)}
                  </span>
                )}
              </div>
            )}
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">
              {t("viewProfile")}
            </span>
          </Link>

          <Link
            href={"/pages/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              {t("accountSettings")}
            </span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
          >
            <LogOutIcon />

            <span className="text-base font-medium">{t("logOut")}</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
