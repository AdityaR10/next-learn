import { useEffect,useState } from "react";

export function useDebounce<T> (value: T, delay?:number){
    const [debounce,setDebounce] = useState(value);
    useEffect(()=>{
        const timer = setTimeout(()=>setDebounce(value),delay||100);
        return () => clearTimeout(timer);
    },[value,delay]);

    return debounce;
}