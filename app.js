require('colors');
const {
    inquirerMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoCheckList
} = require('./helpers/inquirer');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { Tareas } = require('./models/tareas');





const main = async () => {

    let opt = '';

    const tareas = new Tareas();

    const tareasDB = leerDB();

    if (tareasDB) { // cargar tareas
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        //Imprimimos el menu
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                const desc = await leerInput('Descripcion: ');
                tareas.crearTarea(desc);
                break;

            case '2':
                tareas.listadoCompleto();
                break;

            case '3'://listar completadas
                tareas.listarPendientesCompletadas(true);
                break;

            case '4'://listar pendientes
                tareas.listarPendientesCompletadas(false);
                break;

            case '5':// completado |  pendientes
                const ids = await  mostrarListadoCheckList(tareas.listadoArr);
                tareas.toggleCompletadas( ids );
                break;

            case '6'://Borrar
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if (id !== '0') {
                    const ok = await confirmar('¿Esta Seguro?')
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea Borrada');
                    }
                }

                break;
        }


        guardarDB(tareas.listadoArr);

        await pausa();


    } while (opt !== '0');



    //pausa();

}

main();