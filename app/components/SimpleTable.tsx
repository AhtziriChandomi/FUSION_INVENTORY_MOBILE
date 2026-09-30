import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { DataTable, Text, ActivityIndicator } from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

export default function SimpleTable({ columns, data = [], loading = false }) {
    const pageSize = 10;
    const [page, setPage] = useState(0);
    
    const safeData = data || [];
    const totalPages = Math.ceil(safeData.length / pageSize) || 1;
    const paginatedData = safeData.slice(page * pageSize, (page + 1) * pageSize);

    // --- CONFIGURACIÓN RESPONSIVA ---
    // Definimos un ancho mínimo que garantiza que nada se amontone.
    const MIN_COLUMN_WIDTH = 150; 
    const tableWidth = Math.max(screenWidth - 20, columns.length * MIN_COLUMN_WIDTH);

    return (
        <View style={styles.container}>
            {/* ScrollView Horizontal con padding extra al final para evitar cortes */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={{ paddingRight: 10 }} 
            >
                <View style={{ width: tableWidth }}>
                    <DataTable style={styles.table}>
                        
                        {/* HEADER: Usamos Views para evitar restricciones de la librería */}
                        <View style={styles.header}>
                            {columns.map((col, idx) => (
                                <View key={idx} style={[styles.cellBase, { width: tableWidth / columns.length }]}>
                                    <Text style={styles.headerText}>
                                        {col.Header.toUpperCase()}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {loading ? (
                            <View style={styles.infoContainer}>
                                <ActivityIndicator animating={true} size={40} />
                                <Text style={styles.infoText}>Loading...</Text>
                            </View>
                        ) : safeData.length === 0 ? (
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoText}>No data</Text>
                            </View>
                        ) : (
                            paginatedData.map((item, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        styles.row, 
                                        idx % 2 === 0 ? styles.evenRow : styles.oddRow
                                    ]}
                                >
                                    {columns.map((col, cidx) => (
                                        <View 
                                            key={cidx} 
                                            style={[styles.cellBase, { width: tableWidth / columns.length }]}
                                        >
                                            {typeof col.accessor === 'function' ? (
                                                <View style={styles.componentWrapper}>
                                                    {col.accessor(item)}
                                                </View>
                                            ) : (
                                                <Text style={styles.cellText}>
                                                    {item[col.accessor]}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            ))
                        )}
                    </DataTable>
                </View>
            </ScrollView>

            {!loading && safeData.length > 0 && (
                <DataTable.Pagination
                    page={page}
                    numberOfPages={totalPages}
                    onPageChange={setPage}
                    label={`${page + 1} de ${totalPages}`}
                    showFastPaginationControls
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        borderWidth: 1,
        borderColor: '#dee2e6',
        borderRadius: 8,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    table: {
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 2,
        borderBottomColor: '#dee2e6',
        minHeight: 50,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        minHeight: 60, // Mayor altura mínima para acomodar componentes como Chips o Botones
        height: 'auto',
    },
    cellBase: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column', // Permite que el contenido crezca verticalmente
    },
    headerText: {
        fontWeight: 'bold',
        color: '#212529',
        fontSize: 12,
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    cellText: {
        fontSize: 13,
        color: '#495057',
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    componentWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', // Por si hay múltiples botones juntos
        flexWrap: 'wrap',     // Si los botones no caben, bajan de línea en lugar de cortarse
    },
    evenRow: { backgroundColor: '#ffffff' },
    oddRow: { backgroundColor: '#f8f9fa' },
    infoContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        marginTop: 10,
        color: '#6c757d',
    }
});