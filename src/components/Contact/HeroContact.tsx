import { imageAssets } from "../../assets/imageAssets";

export default function HeroContact() {
    return (
        <div className="relative h-[85.9vh] w-full overflow-hidden">
            {/* Background Image with Darkening Overlay */}
            <div className="absolute inset-0">
                <img
                    src={imageAssets.contact_us}
                    alt="Hero background"
                    className="h-full w-full object-cover"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center px-4 sm:px-6 lg:px-8 max-w-360 mx-auto" >
                <div className="max-w-3xl text-left text-white">
                    <p className="mb-3 text-sm 2xl:text-xl font-light tracking-widest uppercase text-gray-300">
                        Hear from us?
                    </p>
                    <h1 className="mb-2 text-5xl md:text-5xl 2xl:text-8xl font-bold leading-tight">
                        Send us a Message today.
                    </h1>
                    <p className="text-lg md:text-xl 2xl:text-2xl font-light text-gray-200 leading-relaxed">
                        We Love To Hear From You With Your Feedback.
                    </p>
                </div>
            </div>
        </div>
    );
}