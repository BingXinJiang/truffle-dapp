package main

import "fmt"

type Humaner interface{
	sayhi()
}
type Personer interface{
	Humaner
	sing(lrc string)
}
type Student struct{
	name string
	age int
}
func (tmp *Student) sayhi(){
	fmt.Printf("Student[%s, %d] sayhi to you !", tmp.name, tmp.age)
}
func (tmp *Student) sing(lrc string){
	fmt.Println("Student is sing: ", lrc)
}

func main(){
	var i Personer
	s := &Student{"mike", 28}

	i = s
	i.sayhi()
	i.sing("my love")
}