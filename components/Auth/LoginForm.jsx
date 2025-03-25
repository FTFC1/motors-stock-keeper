import { useState } from "react";
import { signIn, signUp, resetPassword } from "../../lib/supabase";
import {
  Box,
  Button,
  Text,
  Input,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Flex,
  Link,
  Divider,
  useToast,
  Image,
} from "@chakra-ui/react";

const AuthMode = {
  SIGN_IN: "sign_in",
  SIGN_UP: "sign_up",
  FORGOT_PASSWORD: "forgot_password",
};

export default function LoginForm({ onSuccess }) {
  const [mode, setMode] = useState(AuthMode.SIGN_IN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === AuthMode.SIGN_IN) {
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        onSuccess?.(data);
      } else if (mode === AuthMode.SIGN_UP) {
        const { data, error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
        });
        if (error) throw error;

        toast({
          title: "Account created.",
          description: "Please check your email to confirm your account.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setMode(AuthMode.SIGN_IN);
      } else if (mode === AuthMode.FORGOT_PASSWORD) {
        const { error } = await resetPassword(email);
        if (error) throw error;

        toast({
          title: "Password reset email sent.",
          description: "Please check your email for a password reset link.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setMode(AuthMode.SIGN_IN);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (mode === AuthMode.SIGN_IN) {
      return (
        <>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@mikano-intl.com"
            />
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            mt={6}
            isLoading={loading}
          >
            Sign In
          </Button>

          <Flex mt={4} justifyContent="space-between">
            <Link
              color="blue.500"
              onClick={() => setMode(AuthMode.FORGOT_PASSWORD)}
            >
              Forgot password?
            </Link>
            <Link color="blue.500" onClick={() => setMode(AuthMode.SIGN_UP)}>
              Create account
            </Link>
          </Flex>
        </>
      );
    } else if (mode === AuthMode.SIGN_UP) {
      return (
        <>
          <Stack direction="row" spacing={4}>
            <FormControl isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Last Name</FormLabel>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </FormControl>
          </Stack>

          <FormControl isRequired mt={4}>
            <FormLabel>Company Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@mikano-intl.com"
            />

            <Text fontSize="sm" color="gray.500" mt={1}>
              Must be a @mikano-intl.com or @mikanomotors.com email
            </Text>
          </FormControl>

          <FormControl isRequired mt={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Text fontSize="sm" color="gray.500" mt={1}>
              Minimum 8 characters
            </Text>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            mt={6}
            isLoading={loading}
          >
            Create Account
          </Button>

          <Box mt={4} textAlign="center">
            <Link color="blue.500" onClick={() => setMode(AuthMode.SIGN_IN)}>
              Already have an account? Sign in
            </Link>
          </Box>
        </>
      );
    } else if (mode === AuthMode.FORGOT_PASSWORD) {
      return (
        <>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@mikano-intl.com"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            mt={6}
            isLoading={loading}
          >
            Send Reset Link
          </Button>

          <Box mt={4} textAlign="center">
            <Link color="blue.500" onClick={() => setMode(AuthMode.SIGN_IN)}>
              Back to sign in
            </Link>
          </Box>
        </>
      );
    }
  };

  return (
    <Box
      width="100%"
      maxWidth="450px"
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg="white"
    >
      <Box textAlign="center" mb={8}>
        <Image
          src="/logo.png"
          alt="Mikano Motors"
          height="60px"
          mx="auto"
          mb={4}
        />

        <Heading as="h2" size="xl" mb={2}>
          {mode === AuthMode.SIGN_IN
            ? "Welcome Back"
            : mode === AuthMode.SIGN_UP
              ? "Create Account"
              : "Reset Password"}
        </Heading>
        <Text color="gray.600">
          {mode === AuthMode.SIGN_IN
            ? "Sign in to your RT Inventory account"
            : mode === AuthMode.SIGN_UP
              ? "Join RT Inventory with your company email"
              : "Enter your email to receive a password reset link"}
        </Text>
      </Box>

      {error && (
        <Box bg="red.50" p={4} borderRadius="md" mb={6}>
          <Text color="red.500">{error}</Text>
        </Box>
      )}

      <form onSubmit={handleSubmit}>{renderForm()}</form>
    </Box>
  );
}
