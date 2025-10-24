import Image from "next/image";
export const Logo = () => {
    return (
        <Image
            src={"/ganttastic.svg"}
            alt={"Logo"}
            width={170}
            height={170}
        />
    )
}