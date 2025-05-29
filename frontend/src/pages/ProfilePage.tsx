import { useAuth, User } from "../contexts/AuthContext.tsx";
import Avatar from "../components/ui/Avatar.tsx";
import { HexColorPicker } from "react-colorful";
import { getAxiosInstance } from "../lib/axiosInstance.ts";

export function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  if (!user) throw new Error("No user logged");

  async function handleUpdateUser(file?: File) {
    const client = getAxiosInstance();
    try {
      const form = new FormData();
      if (file) form.append("avatar", file);
      form.append(
        "color",
        getComputedStyle(document.documentElement).getPropertyValue(
          "--color-primary",
        ),
      );
      const response = await client.patch("/auth/me", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUser(response.data as User);
    } catch (e) {
      console.error(e);
    }
  }

  function handleChangeColor(color: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    clearTimeout(window.colorChangeTimeout);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.colorChangeTimeout = setTimeout(() => {
      document.documentElement.style.setProperty("--color-primary", color);
      handleUpdateUser();
    }, 500);
  }

  function handleFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    handleUpdateUser(file);
  }

  return (
    <div className={"flex justify-center m-24 flex-1"}>
      <div className="flex justify-center flex-col items-center">
        <Avatar className={"w-52 h-52"} user={user} />
        <p className={"text-xl font-medium mt-6"}>@{user?.pseudo}</p>

        <div className="mt-6 flex flex-col justify-center">
          <form className="flex flex-col items-center ">
            <label className="mt-6 text-gray-700 font-medium block w-full">
              Primary color
              <div className="mt-2">
                <HexColorPicker
                  color={
                    getComputedStyle(document.documentElement).getPropertyValue(
                      "--color-primary",
                    ) || "#000000"
                  }
                  onChange={handleChangeColor}
                  className="w-full h-8 cursor-pointer"
                />
              </div>
            </label>
            <label className="text-gray-700 font-medium">
              Profile image
              <input
                onChange={handleFile}
                type="file"
                className="block mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </label>
          </form>
          <button
            onClick={() => logout()}
            className="mt-4 px-4 py-2 bg-red-50 text-red-500 cursor-pointer font-semibold rounded hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
