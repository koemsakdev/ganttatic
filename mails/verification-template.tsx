import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Tailwind
} from "@react-email/components";

interface VerificationEmailProps {
    url: string;
    name: string;
}

export const VerificationEmailTemplate = ({
    url,
    name,
}: VerificationEmailProps) => (
    <Html>
        <Head />
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap');
        .font-sora { font-family: 'Sora', sans-serif; }
      `}</style>
        <Preview>Verify your email address</Preview>
        <Tailwind
            config={{
                theme: {
                    extend: {
                        colors: {
                            brand: "#0f172a",
                        },
                    },
                },
            }}
        >
            <Body className="bg-slate-50 my-auto mx-auto font-sora">
                <Container className="rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                    <Heading style={heading}>Dear <strong>{name}</strong>!</Heading>
                    <Text className="text-[14px] text-[#3c4149]">
                        Thanks for starting the new <strong className="text-blue-500">Ganttatic</strong> account creation process. We want to make sure it's really you.
                    </Text>
                    <Hr className="border border-solid border-[#eaeaea] my-[24px] mx-auto" />
                    <Section className="text-center mt-8 mb-8">
                        <Link href={url} className="bg-brand text-white px-[24px] py-[6px] rounded-[40px] bg-blue-500">
                            Verify My Account
                        </Link>
                    </Section>
                    <Text className="text-slate-500 text-[14px] leading-[24px]">
                        If the button doesn't work, please copy and paste the link below into your browser: <Link href={url} className="text-brand underline text-blue-500">{url}</Link>
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
);

const heading = {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "400",
    color: "#484848",
    padding: "17px 0 0",
};
