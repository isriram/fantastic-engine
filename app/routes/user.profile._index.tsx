import { Alert, Button, Card, Container, Group, PasswordInput, SimpleGrid, TextInput, Title } from "@mantine/core";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { identityService } from "~/services/identity-access.server";
import { commitSession, getSession } from "~/services/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
	await identityService.isAuthenticated(request, {
		failureRedirect: "/user/profile/login",
	});
	let session = await getSession(request.headers.get("cookie"));
	let flashMessageText = session.get("flash-message") || JSON.stringify({ title: "", body: "", status: 0 });
	let flashMessage = JSON.parse(flashMessageText);

	let userSession: IUserSession = await session.get(identityService.sessionKey);

	return json([userSession, flashMessage], {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
};

export default function UserProfile() {
	const [userSession, flashMessage] = useLoaderData<typeof loader>();
	return (
		<Container>
			<Title>Hi {`${userSession.first_name} ${userSession.last_name}`}</Title>
			<Card>
				<Form method="post" id="profile-form" action="/api/v1/user/profile/update">
					<TextInput placeholder="Email address" label="Email address" value={userSession.email} disabled />
					<SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
						<TextInput
							placeholder="John"
							label="First name"
							defaultValue={userSession.first_name}
							name="first-name"
							autoComplete="off"
						/>
						<TextInput
							placeholder="Smith"
							label="Last name"
							defaultValue={userSession.last_name}
							name="last-name"
							autoComplete="off"
						/>
					</SimpleGrid>
					<TextInput mt={"md"} label="Current password" name="current-password" type="password" autoComplete="off" />
					<SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
						<PasswordInput label="New password" name="new-password" type="password" />
						<PasswordInput label="Re-enter new password" name="new-password-confirm" type="password" />
					</SimpleGrid>
				</Form>
				<Form method="post" action="/api/user/profile/logout" id="logout-form"></Form>
				<Group mt={"md"} justify="space-between">
					<Button type="submit" variant="outline" form="profile-form" name="action" value="update">
						Update
					</Button>
					<Button variant="subtle" form="logout-form" type="submit" name="action" value="logout">
						Logout
					</Button>
				</Group>
				{flashMessage.status === 200 && (
					<Alert color="green" title={flashMessage.title} mt={"md"}>
						{flashMessage.body}
					</Alert>
				)}
				{flashMessage.status >= 400 && (
					<Alert color="red" title={flashMessage.title} mt={"md"}>
						{flashMessage.body}
					</Alert>
				)}
			</Card>
		</Container>
	);
}
