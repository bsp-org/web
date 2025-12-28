import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import { useForm } from "react-hook-form"
const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { isDirty },
      } = useForm();
    
      return (
        <div className='flex flex-col gap-4 justify-center items-center max-w-xl mx-auto p-4'>
                <form onSubmit={handleSubmit((data) => console.log(data))} className="flex flex-col gap-4 border-2 border-gray-300 rounded-md p-4 w-md">
                <div className="flex flex-col gap-4 items-center">
                    <h1 className='text-2xl font-bold'>Login</h1>
                </div>
                    <div className="flex flex-col gap-4">
                        <Input {...register('email')} type='email' placeholder='Email' className='text-lg' />
                    </div>
                    <div className="flex gap-4 items-center justify-center">
                        <Button className="cursor-pointer" disabled={!isDirty}>Login</Button>
                    </div>
                </form>
        </div>
    )
}

export default Login
