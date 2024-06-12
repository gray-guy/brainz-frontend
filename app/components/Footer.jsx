import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DiscordIcon, LinkedInIcon, XIcon } from "./Svgs";
import logo from "@/public/images/Brainz-logo.png";

const Footer = () => {
  return (
    <div className="flex flex-wrap justify-between px-6 custom:px-[58px] py-[42px] ">
      <div>
        <Link href={"/"}>
          <Image
            src={logo}
            alt="Logo"
            width={80}
            height={50}
            draggable={false}
            priority={true}
          />
        </Link>
        <p className="max-w-[462px] text-grey-425 mt-2">BRAINZ@2024</p>
      </div>
      <div className="mt-[60px] custom:mt-[0]">
        <div className="flex custom:justify-end items-center justify-start gap-5  border-white">
          <Link href="#">
            <XIcon
              width={21}
              height={23}
              className={"text-white hover:text-secondary cursor-pointer"}
            />
          </Link>
          <Link href="#">
            <DiscordIcon
              height={28}
              width={28}
              className={"text-white hover:text-secondary cursor-pointer"}
            />
          </Link>
          <Link href="#">
            <LinkedInIcon
              height={28}
              width={28}
              className={"text-white hover:text-secondary cursor-pointer"}
            />
          </Link>
        </div>
        <div className="flex gap-4 pt-10 text-grey-425 text-sm ">
          <Link href={"#"} className=" hover:text-secondary">
            Privacy Policy
          </Link>
          <Link href={"#"} className=" hover:text-secondary">
            Terms
          </Link>
          <Link href={"#"} className=" hover:text-secondary">
            Legal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
