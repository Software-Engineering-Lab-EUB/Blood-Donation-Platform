import Image from "next/image";
import banner from "../../../../public/images/banner/banner.jpg";
import Link from "next/link";

export default function Banner() {
  return (
    <div className="lg:flex lg:justify-between lg:gap-4 mt-[50px]">
      <div className="w-[700px]">
        <Image className="w-full" src={banner} alt="banner image" height={800} />
      </div>
      <div className="flex flex-col w-[500px] justify-center">
        <h2 className="text-primary leading-[50px] text-4xl font-bold">
          Share Hope, Share Life. <br/> Become a Blood Donor!
        </h2>
        <div className="text-[18px] mt-3 font-semibold flex text-secondary flex-col gap-[8px]">
          <p>
            Every year, millions of patients rely on blood donations for
            life-saving treatments. Your contribution can make a world of
            difference.
          </p>
        </div>
        <div className="flex gap-4 my-4">
          <Link href="/donate" className="btn btn-ghost primary-btn">Donate Blood</Link>
          <Link href="/request" className="btn btn-ghost primary-btn">Request Blood</Link>
        </div>
      </div>
    </div>
  );
}
