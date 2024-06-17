import { Button, Card, Container, TextInput } from "@mantine/core";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { identityService } from "~/services/identity-access.server";

export async function action({ request }: ActionFunctionArgs) {
	await identityService.authenticate("user-pass", request, {
		successRedirect: "/",
		failureRedirect: "/user/profile/login",
		throwOnError: false,
	});

	return null;
}

export default function Login() {
	return (
		<Container>
			<Card>
				<Form method="post">
					<TextInput label="Email address" placeholder="someone@example.com" type="email" name="email" required />
					<TextInput
						label="Password"
						type="password"
						name="password"
						placeholder="********"
						autoComplete="current-password"
						required
					/>
					<Button mt={"md"} type="submit">
						Sign In
					</Button>
				</Form>
			</Card>
		</Container>
	);
}
