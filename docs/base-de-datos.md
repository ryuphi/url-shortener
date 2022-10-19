# Base de datos

## Consideraciones generales

* Se espera una gran cantidad de volumen de datos, operaciones de lectura y
  escritura que se esperan.
* Las operaciones de lectura son más comunes en comparación con las operaciones
  de escritura. No es extraño encontrar relaciones tipo 100:1 (100 lecturas por
  cada escritura).
* Debe ser escalable y tolerante a fallos.
* Altamente disponible.

## SQL vs NoSQL

Si bien se puede utilizar SQL para almacenar datos, no es la mejor opción para
el caso de uso de la aplicación. La razón es que la aplicación no tendrá
consultas complejas donde se requiera un lenguaje de consulta estructurado.
Además, la aplicación no tendrá relaciones entre las entidades, por lo que no se
requiere un modelo relacional y si las relaciones existen, no deberían ser
complejas.

Por otro lado, para cumplir con las consideraciones generales, como la alta
disponibilidad y escalabilidad, una base de datos NoSQL es la mejor opción.
Esto se debe a que las bases de datos NoSQL están diseñadas para escalar de
forma horizontal de manera sencilla.

La gran cantidad de datos y el alto volumen de lectura, también es otro punto a
favor por el cual se debe utilizar una base de datos NoSQL.

Opciones comunes para bases de datos NoSQL son: **MongoDB** y **Cassandra**.

## Comparativa: Mongodb vs Cassandra

Ambas bases de datos son buenas opciones para el sistema, pero hacemos elección
de **Cassandra** para un ambiente productivo (para el desarrollo se utilizó
**MongoDB** por facilidad).

La comparativa se realiza bajo los siguientes términos: **Disponibilidad** y
**Escalabilidad**

### Disponibilidad

**Mongodb** tiene un solo master node para controlar los demás nodos (slave
nodes). Si el nodo master se cae, toma su tiempo el poder promover otro node a
master node. Esto puede causar que la aplicación no pueda escribir datos en la
base de datos.

Por otro lado, __Cassandra__ no tiene master nodes, lo que significa que no hay
un solo punto de falla. Si un nodo se cae, el cluster puede seguir funcionando
sin problemas. Cualquiera de los nodos puede ser utilizado para leer y escribir
datos. Luego el cluster se encarga de replicar los datos en los demás nodos.

### Escalabilidad (en escritura y lectura)

En temas de escritura al no tener un master node donde recaiga la escritura, _
_Cassandra__ nos permite
tener una mejor escalabilidad en cuanto a escritura en comparación a __MongoDB
que solo tiene un master node por réplica set.

En cuanto a lectura, __MongoDB__ debería de tener mejor escalabilidad si
necesitáramos realizar queries más complejas,
esto por las opciones que entrega sobre índices secundarios y elementos
anidados. Dado que en este sistema las queries
solo se llevarán a cabo a través del short url (key generada), podemos
prescindir de estas capacidades.
