import Image from "next/image";
import banner from "../../../../public/images/banner/banner.jpg";
import Link from "next/link";

export default function Banner() {
  return (
    <div className="flex flex-col mt-6 sm:mt-8 md:mt-10 lg:mt-[50px] lg:flex-row lg:justify-between lg:gap-4 px-4 sm:px-6 md:px-8 lg:px-0">
      <div className="w-full lg:w-[700px] mb-6 lg:mb-0">
        <Image 
          className="w-full rounded-lg" 
          src={banner} 
          alt="banner image" 
          height={800}
          priority 
        />
      </div>
      <div className="flex flex-col w-full lg:w-[500px] justify-center">
        <h2 className="text-primary text-2xl sm:text-3xl md:text-4xl font-bold leading-tight sm:leading-tight md:leading-[50px]">
          Share Hope, Share Life. <br className="hidden sm:block"/> Become a Blood Donor!
        </h2>
        <div className="text-base sm:text-lg mt-3 font-semibold flex text-secondary flex-col gap-2">
          <p>
            Every year, millions of patients rely on blood donations for
            life-saving treatments. Your contribution can make a world of
            difference.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 my-4">
          <Link href="/donate" className="btn btn-ghost primary-btn w-full sm:w-auto text-center">Donate Blood</Link>
          <Link href="/request" className="btn btn-ghost primary-btn w-full sm:w-auto text-center">Request Blood</Link>
        </div>
      </div>
    </div>
  );
}