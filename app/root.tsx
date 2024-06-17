import "@mantine/core/styles.css";
import {
	AppShell,
	Burger,
	Button,
	ColorSchemeScript,
	Group,
	MantineProvider,
	ScrollArea,
	createTheme,
	defaultOptionsFilter,
} from "@mantine/core";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { useDisclosure } from "@mantine/hooks";
import { getSession } from "./services/session.server";
import { identityService } from "./services/identity.server";
import Navigation from "./components/Navigation/Navigation";
import User from "./components/Navigation/UserProfile";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

const theme = createTheme({
	colors: {
		svp: ["#E3E5F8", "#959EED", "#4A5BEF", "#0019FF", "#1020B5", "#162181", "#181E5D", "#171B43", "#141731", "#111324"],
	},
	primaryShade: { light: 4, dark: 9 },
	primaryColor: "svp",
	components: {
		Card: {
			defaultProps: {
				mb: "md",
			},
		},
		Badge: {
			defaultProps: {
				size: "lg",
				color: "dark",
				radius: "md",
				style: {
					cursor: "revert",
					margin: "2px",
				},
			},
		},
	},
});

export async function loader({ request }: LoaderFunctionArgs) {
	let session = await getSession(request.headers.get("cookie"));
	let userSession = (await session.get(identityService.sessionKey)) as IUserSession;
	if (!userSession) {
		redirect(`/user/profile/login`);
	}
	return userSession || null;
}

export default function App() {
	const [opened, { toggle }] = useDisclosure();
	const userSession = useLoaderData<typeof loader>();

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider theme={theme}>
					<AppShell
						header={{ height: 60 }}
						navbar={{ width: 300, breakpoint: "xs", collapsed: { mobile: !opened } }}
						padding={"md"}>
						<AppShell.Header>
							<Group>
								<Burger pl={"md"} opened={opened} onClick={toggle} hiddenFrom="xs" size="xs" />
								<Button
									variant="subtle"
									color="black"
									size="xl"
									component="a"
									href="/"
									// leftSection={<Image src={SVPLogo} h={24} w="auto" fit="contain" />}
								>
									Fantastic Engine
								</Button>
							</Group>
						</AppShell.Header>
						<AppShell.Navbar>
							<AppShell.Section grow component={ScrollArea}>
								<Navigation userSession={userSession} />
							</AppShell.Section>
							<AppShell.Section pt={"md"} pb={"md"}>
								<User userSession={userSession} />
							</AppShell.Section>
						</AppShell.Navbar>
						<AppShell.Main>
							<Outlet />
							<ScrollRestoration />
							<Scripts />
						</AppShell.Main>
					</AppShell>
				</MantineProvider>
			</body>
		</html>
	);
}
